import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, DataTable, EmptyState, LoadingSpinner, type DataTableColumn, PageHeader } from '../components/ui';
import { useBranchContext } from '../contexts/BranchContext';
import inventoryService from '../services/inventoryService';
import { 
  Package, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  X
} from 'lucide-react';

type InventoryTransactionRow = {
  id: string;
  date: string;
  product: string;
  transactionType: string;
  quantity: number;
  remark?: string;
  branch: string;
};

const transactionTypeOptions = ['ALL', 'PURCHASE', 'SALE', 'ADJUSTMENT'] as const;

const transactionTypeLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PURCHASE: { 
    label: 'Nhập kho', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <TrendingUp className="w-3 h-3" />
  },
  SALE: { 
    label: 'Bán hàng', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <TrendingDown className="w-3 h-3" />
  },
  ADJUSTMENT: { 
    label: 'Điều chỉnh', 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <AlertCircle className="w-3 h-3" />
  },
};

function downloadCsv(filename: string, rows: InventoryTransactionRow[]) {
  const header = ['Date', 'Product', 'Transaction Type', 'Quantity', 'Remark', 'Branch'];
  const csv = [
    header.join(','),
    ...rows.map((row) =>
      [row.date, row.product, row.transactionType, row.quantity, row.remark ?? '', row.branch]
        .map((value) => `"${String(value).split('"').join('""')}"`)
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StockMovementLog() {
  const { selectedBranchId, branches, loading } = useBranchContext();
  const [productFilter, setProductFilter] = useState('');
  const [transactionType, setTransactionType] = useState<(typeof transactionTypeOptions)[number]>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const branchName = useMemo(
    () => branches.find((b) => b.id === selectedBranchId)?.name ?? '—',
    [branches, selectedBranchId]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory-transactions', selectedBranchId],
    queryFn: async () => {
      if (!selectedBranchId) return [];
      return inventoryService.getTransactionsByBranch(selectedBranchId);
    },
    enabled: !!selectedBranchId,
    retry: false,
  });

  const rows: InventoryTransactionRow[] = (data ?? []).map((tx: any) => ({
    id: tx.id,
    date: tx.createdAt,
    product: tx.inventory?.product?.name ?? '—',
    transactionType: tx.transactionType,
    quantity: tx.quantity,
    remark: tx.remark,
    branch: tx.inventory?.branch?.name ?? branchName,
  }));

  const filteredRows = rows
    .filter((row) => {
      const matchesProduct = row.product.toLowerCase().includes(productFilter.toLowerCase());
      const matchesType = transactionType === 'ALL' || row.transactionType === transactionType;
      const rowDate = row.date ? new Date(row.date).getTime() : 0;
      const matchesFrom = !fromDate || rowDate >= new Date(fromDate).getTime();
      const matchesTo = !toDate || rowDate <= new Date(toDate).getTime();
      return matchesProduct && matchesType && matchesFrom && matchesTo;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Thống kê
  const stats = useMemo(() => {
    const totalTransactions = filteredRows.length;
    const totalPurchase = filteredRows.filter(r => r.transactionType === 'PURCHASE').length;
    const totalSale = filteredRows.filter(r => r.transactionType === 'SALE').length;
    const totalAdjustment = filteredRows.filter(r => r.transactionType === 'ADJUSTMENT').length;
    return { totalTransactions, totalPurchase, totalSale, totalAdjustment };
  }, [filteredRows]);

  const columns: DataTableColumn<InventoryTransactionRow>[] = [
    { 
      key: 'date', 
      header: 'Ngày giờ',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {new Date(r.date).toLocaleString('vi-VN')}
          </span>
        </div>
      )
    },
    { 
      key: 'product', 
      header: 'Sản phẩm',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span className="font-medium text-slate-800">{r.product}</span>
        </div>
      )
    },
    { 
      key: 'transactionType', 
      header: 'Loại giao dịch',
      render: (r) => {
        const type = transactionTypeLabels[r.transactionType];
        return type ? (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${type.color}`}>
            {type.icon}
            {type.label}
          </span>
        ) : (
          <span className="text-slate-500">{r.transactionType}</span>
        );
      }
    },
    { 
      key: 'quantity', 
      header: 'Số lượng',
      render: (r) => (
        <span className={`font-bold ${
          r.transactionType === 'PURCHASE' ? 'text-emerald-600' : 
          r.transactionType === 'SALE' ? 'text-red-600' : 
          'text-amber-600'
        }`}>
          {r.transactionType === 'PURCHASE' ? '+' : r.transactionType === 'SALE' ? '-' : '±'}
          {r.quantity}
        </span>
      )
    },
    { 
      key: 'remark', 
      header: 'Ghi chú', 
      render: (r) => (
        <span className="text-slate-500 text-sm">{r.remark ?? '—'}</span>
      )
    },
    { 
      key: 'branch', 
      header: 'Chi nhánh',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sm text-slate-600">{r.branch}</span>
        </div>
      )
    },
  ];

  const hasRows = filteredRows.length > 0;

  const clearFilters = () => {
    setProductFilter('');
    setTransactionType('ALL');
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = productFilter || transactionType !== 'ALL' || fromDate || toDate;

  return (
    <div className="space-y-6">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" />
              Lịch sử tồn kho
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Theo dõi nhập, bán và điều chỉnh tồn kho theo chi nhánh
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedBranchId && (
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {branchName}
              </span>
            )}
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
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
      {selectedBranchId && !isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalTransactions}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Nhập kho</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.totalPurchase}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bán hàng</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalSale}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Điều chỉnh</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.totalAdjustment}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Đang tải chi nhánh..." />
      ) : !selectedBranchId ? (
        <EmptyState
          title="Chưa chọn chi nhánh"
          description="Hãy chọn chi nhánh ở thanh trên cùng để xem lịch sử tồn kho tương ứng."
        />
      ) : (
        <div className="ui-card space-y-4">
          {/* Filters */}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="ui-input pl-9"
                placeholder="Lọc theo sản phẩm..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="ui-input pl-9"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as typeof transactionType)}
              >
                {transactionTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t === 'ALL' ? 'Tất cả loại' : transactionTypeLabels[t]?.label || t}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="ui-input pl-9" 
                type="date" 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
                placeholder="Từ ngày"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="ui-input pl-9" 
                type="date" 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-medium text-slate-900">{filteredRows.length}</span> giao dịch
                {hasActiveFilters && (
                  <span className="ml-1 text-xs text-slate-400">(đã lọc)</span>
                )}
              </p>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Xóa lọc
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => downloadCsv('stock-movement.csv', filteredRows)} 
                disabled={!hasRows}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredRows}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải lịch sử tồn kho.' : null}
            emptyTitle="Chưa có giao dịch"
            emptyDescription="Lịch sử tồn kho sẽ hiển thị ở đây."
          />
        </div>
      )}
    </div>
  );
}