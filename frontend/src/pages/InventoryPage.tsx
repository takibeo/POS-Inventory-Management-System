import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import inventoryService from '../services/inventoryService';
import type { Inventory } from '../types/inventory';

function formatNumber(value: number) {
  return value.toLocaleString('vi-VN');
}

export default function InventoryPage() {
  const [selectedBranchId, setSelectedBranchId] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventories'],
    queryFn: inventoryService.getInventories,
    retry: false,
  });

  const filtered = useMemo(() => {
    if (!selectedBranchId) return data ?? [];
    return (data ?? []).filter((item) => item.branchId === selectedBranchId);
  }, [data, selectedBranchId]);

  const branchOptions = useMemo(() => {
    return Array.from(new Set((data ?? []).map((item) => item.branchId)));
  }, [data]);

  const columns: DataTableColumn<Inventory>[] = [
    { key: 'branchId', header: 'Chi nhánh' },
    { key: 'productId', header: 'Sản phẩm' },
    { key: 'quantity', header: 'Số lượng', render: (row) => formatNumber(row.quantity) },
    { key: 'reservedQuantity', header: 'Đã giữ', render: (row) => formatNumber(row.reservedQuantity) },
    {
      key: 'availableQuantity',
      header: 'Khả dụng',
      render: (row) => (
        <span className={`font-semibold ${row.availableQuantity <= 0 ? 'text-red-600' : 'text-emerald-700'}`}>
          {formatNumber(row.availableQuantity)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý tồn kho"
        description="Xem tồn kho theo chi nhánh và theo dõi số lượng khả dụng."
      />

      <div className="ui-card space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Bộ lọc</h3>
            <p className="text-sm text-slate-500">Chọn chi nhánh để lọc danh sách tồn kho.</p>
          </div>
          <div className="w-full md:w-72">
            <label className="ui-label">Chi nhánh</label>
            <select
              className="ui-input"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">Tất cả chi nhánh</option>
              {branchOptions.map((branchId) => (
                <option key={branchId} value={branchId}>
                  {branchId}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={isError ? 'Không thể tải danh sách tồn kho.' : null}
          emptyTitle="Chưa có dữ liệu tồn kho"
          emptyDescription="Backend chưa trả dữ liệu hoặc chưa có inventory record."
        />

        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Chức năng điều chỉnh tồn kho sẽ được bật khi backend `inventories/adjust` được nối vào UI chi tiết.
        </p>
      </div>
    </div>
  );
}
