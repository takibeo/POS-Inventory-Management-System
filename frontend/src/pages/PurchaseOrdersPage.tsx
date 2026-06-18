import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import purchaseOrderService from '../services/purchaseOrderService';
import type { PurchaseOrder, PurchaseOrderItem } from '../types/purchaseOrder';

const orderStatusLabels: Record<string, string> = {
  DRAFT: 'Nháp',
  SUBMITTED: 'Đã gửi',
  RECEIVED: 'Đã nhận',
};

const orderStatusClass: Record<string, string> = {
  DRAFT: 'ui-badge ui-badge-yellow',
  SUBMITTED: 'ui-badge ui-badge-blue',
  RECEIVED: 'ui-badge ui-badge-green',
};

const defaultForm = {
  supplierId: '',
  branchId: '',
  notes: '',
};

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export default function PurchaseOrdersPage() {
  const [activeOrder, setActiveOrder] = useState<PurchaseOrder | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: purchaseOrderService.getPurchaseOrders,
    retry: false,
  });

  const columns: DataTableColumn<PurchaseOrder>[] = useMemo(
    () => [
      { key: 'orderNumber', header: 'Mã đơn' },
      { key: 'supplierName', header: 'Nhà cung cấp', render: (row) => row.supplierId },
      { key: 'branchName', header: 'Chi nhánh', render: (row) => row.branchId },
      {
        key: 'status',
        header: 'Trạng thái',
        render: (row) => (
          <span className={orderStatusClass[row.status] ?? 'ui-badge'}>
            {orderStatusLabels[row.status] ?? row.status}
          </span>
        ),
      },
      {
        key: 'totalAmount',
        header: 'Tổng tiền',
        render: (row) => <span className="font-semibold">{formatCurrency(row.totalAmount)}</span>,
      },
    ],
    []
  );

  const itemsColumns: DataTableColumn<PurchaseOrderItem>[] = [
    { key: 'productId', header: 'Sản phẩm' },
    { key: 'quantity', header: 'Số lượng' },
    { key: 'cost', header: 'Giá nhập', render: (row) => formatCurrency(row.cost) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn nhập kho"
        description="Theo dõi trạng thái đơn, tạo đơn mới và nhận hàng từ nhà cung cấp."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="ui-card space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Tạo đơn nhập kho</h3>
            <p className="text-sm text-slate-500">
              Giao diện đã sẵn sàng, chờ backend contract đầy đủ để nối dữ liệu thực.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="ui-label">Nhà cung cấp</label>
              <input
                className="ui-input"
                value={form.supplierId}
                onChange={(e) => setForm((prev) => ({ ...prev, supplierId: e.target.value }))}
                placeholder="UUID nhà cung cấp"
              />
            </div>
            <div>
              <label className="ui-label">Chi nhánh</label>
              <input
                className="ui-input"
                value={form.branchId}
                onChange={(e) => setForm((prev) => ({ ...prev, branchId: e.target.value }))}
                placeholder="UUID chi nhánh"
              />
            </div>
            <div>
              <label className="ui-label">Ghi chú</label>
              <textarea
                className="ui-input"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Ghi chú cho đơn nhập kho"
              />
            </div>
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Backend `purchase-orders` hiện chưa có request/response chuẩn để submit thực tế.
            </p>
          </div>
        </div>

        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Danh sách đơn nhập kho</h3>
          <DataTable
            columns={columns}
            data={data ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách đơn nhập kho.' : null}
            emptyTitle="Chưa có đơn nhập kho"
            emptyDescription="Tạo đơn mới khi backend sẵn sàng."
            renderActions={(row) => (
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium hover:border-slate-900 hover:text-slate-900"
                onClick={() => setActiveOrder(row)}
              >
                Chi tiết
              </button>
            )}
          />
        </div>
      </div>

      {activeOrder && (
        <div className="ui-card space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Chi tiết đơn {activeOrder.orderNumber}</h3>
              <p className="text-sm text-slate-500">
                Trạng thái: {orderStatusLabels[activeOrder.status] ?? activeOrder.status}
              </p>
            </div>
            <button
              type="button"
              className="ui-btn ui-btn-secondary"
              onClick={() => setActiveOrder(null)}
            >
              Đóng
            </button>
          </div>

          <DataTable
            columns={itemsColumns}
            data={activeOrder.items ?? []}
            rowKey={(_, index) => `${activeOrder.id}-${index}`}
            isLoading={false}
            emptyTitle="Không có mặt hàng"
            emptyDescription="Đơn này chưa có chi tiết sản phẩm."
          />
        </div>
      )}
    </div>
  );
}
