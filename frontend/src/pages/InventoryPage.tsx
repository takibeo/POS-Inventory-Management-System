import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, DataTable, EmptyState, LoadingSpinner, type DataTableColumn, PageHeader } from '../components/ui';
import { useBranchContext } from '../contexts/BranchContext';
import inventoryService from '../services/inventoryService';
import productService from '../services/productService';
import type { Inventory } from '../types/inventory';
import type { Product } from '../types/product';
import { 
  Package, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Building2,
  Box,
  PackageCheck,
  PackageX,
  Search,
  X
} from 'lucide-react';

function formatNumber(value: number) {
  return value.toLocaleString('vi-VN');
}

export default function InventoryPage() {
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const { branches } = useBranchContext();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventories'],
    queryFn: inventoryService.getInventories,
    retry: false,
  });

  const { data: products = [] } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    retry: false,
  });

  const filtered = useMemo(() => {
    if (!selectedBranchId) return data ?? [];
    return (data ?? []).filter((item) => item.branchId === selectedBranchId);
  }, [data, selectedBranchId]);

  const branchOptions = useMemo(() => {
    return Array.from(new Set((data ?? []).map((item) => item.branchId)));
  }, [data]);

  // Thống kê
  const stats = useMemo(() => {
    const items = selectedBranchId ? filtered : data ?? [];
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAvailable = items.reduce((sum, item) => sum + item.availableQuantity, 0);
    const lowStockItems = items.filter((item) => item.availableQuantity <= 0).length;
    return { totalItems, totalQuantity, totalAvailable, lowStockItems };
  }, [data, filtered, selectedBranchId]);

  const columns: DataTableColumn<Inventory>[] = [
    { 
      key: 'branchId', 
      header: 'Chi nhánh',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">{getBranchName(row.branchId)}</span>
        </div>
      )
    },
    { 
      key: 'productId', 
      header: 'Sản phẩm',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-slate-800">{getProductName(row.productId)}</span>
        </div>
      )
    },
    { 
      key: 'quantity', 
      header: 'Tồn kho',
      render: (row) => (
        <span className="font-semibold text-slate-700">
          {formatNumber(row.quantity)}
        </span>
      )
    },
    { 
      key: 'reservedQuantity', 
      header: 'Đã giữ',
      render: (row) => (
        <span className="text-amber-600">
          {formatNumber(row.reservedQuantity)}
        </span>
      )
    },
    {
      key: 'availableQuantity',
      header: 'Khả dụng',
      render: (row) => {
        const isLow = row.availableQuantity <= 0;
        const isWarning = row.availableQuantity > 0 && row.availableQuantity <= 5;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLow ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
              {formatNumber(row.availableQuantity)}
            </span>
            {isLow && (
              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Hết hàng
              </span>
            )}
            {isWarning && !isLow && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Sắp hết
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const getBranchName = (branchId: string) => {
    return branches.find((branch) => branch.id === branchId)?.name ?? branchId;
  };

  const getProductName = (productId: string) => {
    return products.find((product) => product.id === productId)?.name ?? productId;
  };

  return (
    <div className="space-y-6">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-6 h-6" />
              Quản lý tồn kho
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Xem tồn kho theo chi nhánh và theo dõi số lượng khả dụng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {stats.totalItems} mặt hàng
            </span>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-emerald-700 hover:text-emerald-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tổng mặt hàng</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalItems}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tổng tồn kho</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatNumber(stats.totalQuantity)}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Khả dụng</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatNumber(stats.totalAvailable)}</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Hết hàng</p>
              <p className={`text-2xl font-bold mt-1 ${stats.lowStockItems > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {stats.lowStockItems}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stats.lowStockItems > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
              {stats.lowStockItems > 0 ? (
                <PackageX className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ui-card space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              Bộ lọc
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">Chọn chi nhánh để lọc danh sách tồn kho</p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-end">
            <div className="w-full md:w-72">
              <label className="ui-label flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Chi nhánh
              </label>
              <select
                className="ui-input"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option value="">🏢 Tất cả chi nhánh</option>
                {branchOptions.map((branchId) => (
                  <option key={branchId} value={branchId}>
                    {getBranchName(branchId)}
                  </option>
                ))}
              </select>
            </div>
            {selectedBranchId && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setSelectedBranchId('')}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        {isError ? (
          <EmptyState
            variant="error"
            title="Không thể tải tồn kho"
            description="Vui lòng kiểm tra API inventories rồi thử lại."
            action={
              <Button type="button" variant="secondary" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            emptyTitle="Chưa có dữ liệu tồn kho"
            emptyDescription="Backend chưa trả dữ liệu hoặc chưa có inventory record."
          />
        )}

        {/* Info Note */}
        <div className="flex items-start gap-3 rounded-xl bg-amber-50/80 border border-amber-200/60 px-4 py-3.5 text-sm text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Tính năng đang phát triển</p>
            <p className="text-amber-700/80 text-xs mt-0.5">
              Chức năng điều chỉnh tồn kho sẽ được bật khi backend `inventories/adjust` được nối vào UI chi tiết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}