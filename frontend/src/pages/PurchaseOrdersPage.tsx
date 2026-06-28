import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, ConfirmModal, DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import purchaseOrderService from '../services/purchaseOrderService';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import branchService from '../services/branchService';
import type { PurchaseOrder, PurchaseOrderItem } from '../types/purchaseOrder';
import type { Product } from '../types/product';
import type { Branch } from '../types/branch';
import type { Supplier } from '../types/supplier';

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

type FormItem = {
  productId: string;
  quantity: number;
  cost: number;
};

const defaultForm = {
  supplierId: '',
  branchId: '',
  notes: '',
  items: [] as FormItem[],
};

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export default function PurchaseOrdersPage() {
  const queryClient = useQueryClient();
  const [activeOrder, setActiveOrder] = useState<PurchaseOrder | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [confirmReceive, setConfirmReceive] = useState<PurchaseOrder | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: purchaseOrderService.getPurchaseOrders,
    retry: false,
  });

  const { data: products = [] } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  const { data: suppliers = [] } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
  });

  const { data: branches = [] } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: branchService.getBranches,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => purchaseOrderService.createPurchaseOrder(payload),
    onSuccess: () => {
      toast.success('Tạo đơn nhập kho thành công.');
      setForm(defaultForm);
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
    },
    onError: () => toast.error('Không thể tạo đơn nhập kho.'),
  });

  const receiveMutation = useMutation({
    mutationFn: (id: string) => purchaseOrderService.receivePurchaseOrder(id),
    onSuccess: () => {
      toast.success('Nhận hàng thành công.');
      setConfirmReceive(null);
      setActiveOrder(null);
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      refetch();
    },
    onError: () => toast.error('Không thể nhận hàng.'),
  });

  const getProductName = (productId: string) => products.find((p) => p.id === productId)?.name ?? productId;
  const getSupplierName = (supplierId: string) => suppliers.find((s) => s.id === supplierId)?.name ?? supplierId;
  const getBranchName = (branchId: string) => branches.find((b) => b.id === branchId)?.name ?? branchId;

  const columns: DataTableColumn<PurchaseOrder>[] = useMemo(
    () => [
      { key: 'orderNumber', header: 'Mã đơn' },
      { key: 'supplier', header: 'Nhà cung cấp', render: (row) => getSupplierName(row.supplierId) },
      { key: 'branch', header: 'Chi nhánh', render: (row) => getBranchName(row.branchId) },
      {
        key: 'status',
        header: 'Trạng thái',
        render: (row) => <span className={orderStatusClass[row.status] ?? 'ui-badge'}>{orderStatusLabels[row.status] ?? row.status}</span>,
      },
      { key: 'totalAmount', header: 'Tổng tiền', render: (row) => <span className="font-semibold">{formatCurrency(row.totalAmount)}</span> },
    ],
    [suppliers, branches]
  );

  const itemsColumns: DataTableColumn<PurchaseOrderItem>[] = [
    { key: 'productName', header: 'Sản phẩm', render: (row) => getProductName(row.productId) },
    { key: 'quantity', header: 'Số lượng' },
    { key: 'cost', header: 'Giá nhập', render: (row) => formatCurrency(row.cost) },
  ];

  const exportCsv = () => {
    const header = ['Order Number', 'Supplier', 'Branch', 'Status', 'Total Amount'];
    const csv = [
      header.join(','),
      ...(data ?? []).map((row) =>
        [row.orderNumber, getSupplierName(row.supplierId), getBranchName(row.branchId), row.status, row.totalAmount]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printActiveOrder = () => {
    window.print();
  };

  const addItemToForm = () => setForm((prev) => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1, cost: 0 }] }));
  const removeItemFromForm = (index: number) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const updateFormItem = (index: number, key: keyof FormItem, value: any) => setForm((prev) => ({ ...prev, items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)) }));

  const handleSubmitOrder = () => {
    if (!form.supplierId) return toast.error('Vui lòng chọn nhà cung cấp.');
    if (!form.branchId) return toast.error('Vui lòng chọn chi nhánh.');
    if (form.items.length === 0) return toast.error('Vui lòng thêm ít nhất một sản phẩm.');
    createMutation.mutate({ supplierId: form.supplierId, branchId: form.branchId, notes: form.notes, items: form.items });
  };

  const handleReceive = () => {
    if (!confirmReceive?.id) return;
    receiveMutation.mutate(confirmReceive.id);
  };

  return (
    <div className="space-y-6 print:bg-white print:text-black">
      <PageHeader title="Đơn nhập kho" description="Theo dõi trạng thái đơn, tạo đơn mới và nhận hàng từ nhà cung cấp." />

      <div className="flex justify-end gap-2 print:hidden">
        <Button type="button" variant="secondary" onClick={exportCsv} disabled={(data ?? []).length === 0}>
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[500px_1fr] print:block">
        <div className="ui-card space-y-4 print:hidden">
          <div>
            <h3 className="text-lg font-semibold">Tạo đơn nhập kho</h3>
            <p className="text-sm text-slate-500">Điền thông tin và thêm sản phẩm vào danh sách.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="ui-label">Nhà cung cấp *</label>
              <select className="ui-input" value={form.supplierId} onChange={(e) => setForm((prev) => ({ ...prev, supplierId: e.target.value }))}>
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
            </div>
            <div>
              <label className="ui-label">Chi nhánh *</label>
              <select className="ui-input" value={form.branchId} onChange={(e) => setForm((prev) => ({ ...prev, branchId: e.target.value }))}>
                <option value="">Chọn chi nhánh</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>

            <div className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Danh sách sản phẩm</h4>
                <Button type="button" onClick={addItemToForm} disabled={createMutation.isPending}>
                  + Thêm
                </Button>
              </div>

              {form.items.length > 0 ? (
                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div key={index} className="space-y-2 rounded border border-slate-200 p-3">
                      <div>
                        <label className="ui-label text-xs">Sản phẩm</label>
                        <select className="ui-input text-sm" value={item.productId} onChange={(e) => updateFormItem(index, 'productId', e.target.value)}>
                          <option value="">Chọn sản phẩm</option>
                          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="ui-label text-xs">Số lượng</label>
                          <input type="number" min="1" className="ui-input text-sm" value={item.quantity} onChange={(e) => updateFormItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                        </div>
                        <div>
                          <label className="ui-label text-xs">Giá nhập</label>
                          <input type="number" min="0" step="0.01" className="ui-input text-sm" value={item.cost} onChange={(e) => updateFormItem(index, 'cost', parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => removeItemFromForm(index)}
                        disabled={createMutation.isPending}
                      >
                        Xoá
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có sản phẩm nào. Hãy thêm sản phẩm.</p>
              )}
            </div>

            <div>
              <label className="ui-label">Ghi chú</label>
              <textarea className="ui-input" rows={3} value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Ghi chú cho đơn nhập kho" />
            </div>

            <Button type="button" onClick={handleSubmitOrder} disabled={!form.supplierId || !form.branchId || form.items.length === 0 || createMutation.isPending}>
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo đơn'}
            </Button>
          </div>
        </div>

        <div className="ui-card print:hidden">
          <h3 className="mb-4 text-lg font-semibold">Danh sách đơn nhập kho</h3>
          <DataTable
            columns={columns}
            data={data ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách đơn nhập kho.' : null}
            emptyTitle="Chưa có đơn nhập kho"
            emptyDescription="Tạo đơn mới bằng form bên trái."
            renderActions={(row) => (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveOrder(row)}
              >
                Chi tiết
              </Button>
            )}
          />
        </div>
      </div>

      {activeOrder && (
        <div className="ui-card space-y-4 print:shadow-none">
          <div className="flex items-center justify-between gap-4 print:hidden">
            <div>
              <h3 className="text-lg font-semibold">Chi tiết đơn {activeOrder.orderNumber}</h3>
              <p className="text-sm text-slate-500">Trạng thái: {orderStatusLabels[activeOrder.status] ?? activeOrder.status}</p>
            </div>
            <div className="flex gap-2">
              {activeOrder.status !== 'RECEIVED' && (
                <Button type="button" onClick={() => setConfirmReceive(activeOrder)} disabled={receiveMutation.isPending}>
                  {receiveMutation.isPending ? 'Đang xử lý...' : 'Nhận hàng'}
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={printActiveOrder}>
                In
              </Button>
              <Button type="button" variant="secondary" onClick={() => setActiveOrder(null)}>
                Đóng
              </Button>
            </div>
          </div>

          <div className="hidden print:block">
            <h2 className="text-xl font-bold">Đơn nhập kho {activeOrder.orderNumber}</h2>
            <p>Trạng thái: {orderStatusLabels[activeOrder.status] ?? activeOrder.status}</p>
            <p>Nhà cung cấp: {getSupplierName(activeOrder.supplierId)}</p>
            <p>Chi nhánh: {getBranchName(activeOrder.branchId)}</p>
            <p>Ghi chú: {activeOrder.notes || '—'}</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-700">Thông tin đơn</h4>
            <div className="grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-2 print:bg-transparent">
              <div>
                <p className="text-sm text-slate-600">Nhà cung cấp</p>
                <p className="font-semibold">{getSupplierName(activeOrder.supplierId)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Chi nhánh</p>
                <p className="font-semibold">{getBranchName(activeOrder.branchId)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tổng tiền</p>
                <p className="font-semibold">{formatCurrency(activeOrder.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Ghi chú</p>
                <p className="text-sm">{activeOrder.notes || '—'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-700">Danh sách sản phẩm</h4>
            <DataTable columns={itemsColumns} data={activeOrder.items ?? []} rowKey={(_, index) => `${activeOrder.id}-${index}`} isLoading={false} emptyTitle="Không có mặt hàng" emptyDescription="Đơn này chưa có chi tiết sản phẩm." />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmReceive}
        title="Xác nhận nhận hàng"
        message={`Bạn có chắc muốn nhận hàng từ đơn ${confirmReceive?.orderNumber}?`}
        onConfirm={handleReceive}
        onCancel={() => setConfirmReceive(null)}
        isLoading={receiveMutation.isPending}
      />
    </div>
  );
}
