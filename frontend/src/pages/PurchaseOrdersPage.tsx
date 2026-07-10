import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, ConfirmModal, DataTable, EmptyState, LoadingSpinner, type DataTableColumn, PageHeader } from '../components/ui';
import purchaseOrderService from '../services/purchaseOrderService';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import branchService from '../services/branchService';
import type { PurchaseOrder, PurchaseOrderItem } from '../types/purchaseOrder';
import type { Product } from '../types/product';
import type { Branch } from '../types/branch';
import type { Supplier } from '../types/supplier';
import { 
  Plus, 
  Download, 
  Eye, 
  X, 
  Package, 
  Truck, 
  Building2, 
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  ShoppingBag,
  DollarSign
} from 'lucide-react';

const orderStatusLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  DRAFT: { 
    label: 'Nháp', 
    icon: <Clock className="w-3.5 h-3.5" />
  },
  SUBMITTED: { 
    label: 'Đã gửi', 
    icon: <AlertCircle className="w-3.5 h-3.5" />
  },
  RECEIVED: { 
    label: 'Đã nhận', 
    icon: <CheckCircle className="w-3.5 h-3.5" />
  },
};

const orderStatusClass: Record<string, string> = {
  DRAFT: 'bg-amber-100 text-amber-700 border-amber-200',
  SUBMITTED: 'bg-blue-100 text-blue-700 border-blue-200',
  RECEIVED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

type FormItem = {
  productId: string;
  quantity: number;
  cost: number;
};

type PurchaseOrderForm = {
  supplierId: string;
  branchId: string;
  notes: string;
  items: FormItem[];
};

const defaultForm: PurchaseOrderForm = {
  supplierId: '',
  branchId: '',
  notes: '',
  items: [],
};

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export default function PurchaseOrdersPage() {
  const queryClient = useQueryClient();
  const [activeOrder, setActiveOrder] = useState<PurchaseOrder | null>(null);
  const [form, setForm] = useState<PurchaseOrderForm>(defaultForm);
  const [confirmReceive, setConfirmReceive] = useState<PurchaseOrder | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: purchaseOrderService.getPurchaseOrders,
    retry: false,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    retry: false,
  });

  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
    retry: false,
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: branchService.getBranches,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) => purchaseOrderService.createPurchaseOrder(payload),
    onSuccess: () => {
      toast.success('Tạo đơn nhập kho thành công.');
      setForm(defaultForm);
      setShowForm(false);
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

  const getProductName = (productId: string) =>
    products.find((p) => p.id === productId)?.name ?? productId;
  const getSupplierName = (supplierId: string) =>
    suppliers.find((s) => s.id === supplierId)?.name ?? supplierId;
  const getBranchName = (branchId: string) =>
    branches.find((b) => b.id === branchId)?.name ?? branchId;

  // Thống kê
  const stats = useMemo(() => {
    const orders = data ?? [];
    const totalOrders = orders.length;
    const draftOrders = orders.filter(o => o.status === 'DRAFT').length;
    const submittedOrders = orders.filter(o => o.status === 'SUBMITTED').length;
    const receivedOrders = orders.filter(o => o.status === 'RECEIVED').length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { totalOrders, draftOrders, submittedOrders, receivedOrders, totalValue };
  }, [data]);

  const columns: DataTableColumn<PurchaseOrder>[] = useMemo(
    () => [
      { 
        key: 'orderNumber', 
        header: 'Mã đơn',
        render: (row) => (
          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
            {row.orderNumber}
          </span>
        )
      },
      { 
        key: 'supplier', 
        header: 'Nhà cung cấp', 
        render: (row) => (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{getSupplierName(row.supplierId)}</span>
          </div>
        )
      },
      { 
        key: 'branch', 
        header: 'Chi nhánh', 
        render: (row) => (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{getBranchName(row.branchId)}</span>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Trạng thái',
        render: (row) => (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${orderStatusClass[row.status] ?? 'bg-slate-100 text-slate-700'}`}>
            {orderStatusLabels[row.status]?.icon}
            {orderStatusLabels[row.status]?.label ?? row.status}
          </span>
        ),
      },
      {
        key: 'totalAmount',
        header: 'Tổng tiền',
        render: (row) => (
          <span className="font-semibold text-emerald-600">
            {formatCurrency(row.totalAmount)}
          </span>
        ),
      },
    ],
    [suppliers, branches]
  );

  const itemsColumns: DataTableColumn<PurchaseOrderItem>[] = [
    { 
      key: 'productName', 
      header: 'Sản phẩm', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span>{getProductName(row.productId)}</span>
        </div>
      )
    },
    { 
      key: 'quantity', 
      header: 'Số lượng',
      render: (row) => <span className="font-medium">{row.quantity}</span>
    },
    { 
      key: 'cost', 
      header: 'Giá nhập', 
      render: (row) => <span className="text-slate-600">{formatCurrency(row.cost)}</span>
    },
    {
      key: 'total',
      header: 'Thành tiền',
      render: (row) => <span className="font-semibold text-slate-800">{formatCurrency(row.cost * row.quantity)}</span>
    }
  ];

  const exportCsv = () => {
    const header = ['Order Number', 'Supplier', 'Branch', 'Status', 'Total Amount'];
    const csv = [
      header.join(','),
      ...(data ?? []).map((row) =>
        [row.orderNumber, getSupplierName(row.supplierId), getBranchName(row.branchId), row.status, row.totalAmount]
          .map((value) => `"${String(value).split('"').join('""')}"`)
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

  const addItemToForm = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1, cost: 0 }] }));
  const removeItemFromForm = (index: number) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const updateFormItem = (index: number, key: keyof FormItem, value: string | number) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  const handleSubmitOrder = () => {
    if (!form.supplierId) return toast.error('Vui lòng chọn nhà cung cấp.');
    if (!form.branchId) return toast.error('Vui lòng chọn chi nhánh.');
    if (form.items.length === 0) return toast.error('Vui lòng thêm ít nhất một sản phẩm.');
    if (form.items.some((item) => !item.productId || item.quantity <= 0 || item.cost < 0)) {
      return toast.error('Vui lòng kiểm tra lại số lượng và giá nhập.');
    }
    createMutation.mutate({
      supplierId: form.supplierId,
      branchId: form.branchId,
      notes: form.notes,
      status: 'SUBMITTED',
      items: form.items,
    });
  };

  const handleReceive = () => {
    if (!confirmReceive?.id) return;
    receiveMutation.mutate(confirmReceive.id);
  };

  const isLoadingMasterData = suppliersLoading || branchesLoading || productsLoading;

  return (
    <div className="space-y-6 print:bg-white print:text-black">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Đơn nhập kho
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Quản lý đơn nhập kho từ nhà cung cấp
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {stats.totalOrders} đơn
            </span>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="w-4 h-4" />
              Tạo đơn mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tổng đơn</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Chờ xử lý</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.draftOrders + stats.submittedOrders}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Đã nhận</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.receivedOrders}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tổng giá trị</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 print:hidden">
        <Button type="button" variant="secondary" onClick={exportCsv} disabled={(data ?? []).length === 0} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[500px_1fr] print:block">
        {/* Form Section */}
        {showForm && (
          <div className="ui-card space-y-4 print:hidden relative">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setForm(defaultForm);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Tạo đơn nhập kho
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">Điền thông tin và thêm sản phẩm vào danh sách</p>
            </div>

            {isLoadingMasterData ? (
              <LoadingSpinner label="Đang tải dữ liệu danh mục..." />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="ui-label flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Nhà cung cấp <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="ui-input"
                      value={form.supplierId}
                      onChange={(e) => setForm((prev) => ({ ...prev, supplierId: e.target.value }))}
                    >
                      <option value="">Chọn nhà cung cấp</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="ui-label flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Chi nhánh <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="ui-input"
                      value={form.branchId}
                      onChange={(e) => setForm((prev) => ({ ...prev, branchId: e.target.value }))}
                    >
                      <option value="">Chọn chi nhánh</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Danh sách sản phẩm
                    </h4>
                    <Button type="button" onClick={addItemToForm} disabled={createMutation.isPending} variant="secondary" className="text-sm">
                      <Plus className="w-3.5 h-3.5" />
                      Thêm
                    </Button>
                  </div>

                  {form.items.length > 0 ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {form.items.map((item, index) => (
                        <div key={index} className="space-y-2 rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <label className="ui-label text-xs">Sản phẩm</label>
                              <select
                                className="ui-input text-sm"
                                value={item.productId}
                                onChange={(e) => updateFormItem(index, 'productId', e.target.value)}
                              >
                                <option value="">Chọn sản phẩm</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItemFromForm(index)}
                              className="mt-5 p-1 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="ui-label text-xs">Số lượng</label>
                              <input
                                type="number"
                                min="1"
                                className="ui-input text-sm"
                                value={item.quantity}
                                onChange={(e) => updateFormItem(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                              />
                            </div>
                            <div>
                              <label className="ui-label text-xs">Giá nhập</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="ui-input text-sm"
                                value={item.cost}
                                onChange={(e) => updateFormItem(index, 'cost', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Chưa có sản phẩm nào"
                      description="Hãy thêm ít nhất một dòng sản phẩm để tạo đơn nhập kho."
                    />
                  )}
                </div>

                <div>
                  <label className="ui-label flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Ghi chú
                  </label>
                  <textarea
                    className="ui-input"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Nhập ghi chú cho đơn nhập kho..."
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={!form.supplierId || !form.branchId || form.items.length === 0 || createMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  {createMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner label="Đang tạo..." />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Tạo đơn nhập kho
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Table Section */}
        <div className="ui-card print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Danh sách đơn nhập kho</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị {data?.length || 0} đơn nhập kho
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách đơn nhập kho.' : null}
            emptyTitle="Chưa có đơn nhập kho"
            emptyDescription="Nhấn 'Tạo đơn mới' để tạo đơn nhập kho đầu tiên."
            renderActions={(row) => (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveOrder(row)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
              >
                <Eye className="w-4 h-4" />
                Chi tiết
              </Button>
            )}
          />
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="ui-card space-y-4 print:shadow-none">
          <div className="flex items-center justify-between gap-4 print:hidden">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                Chi tiết đơn {activeOrder.orderNumber}
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Trạng thái: {orderStatusLabels[activeOrder.status]?.label ?? activeOrder.status}
              </p>
            </div>
            <div className="flex gap-2">
              {activeOrder.status !== 'RECEIVED' && (
                <Button 
                  type="button" 
                  onClick={() => setConfirmReceive(activeOrder)} 
                  disabled={receiveMutation.isPending}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  {receiveMutation.isPending ? 'Đang xử lý...' : 'Nhận hàng'}
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={printActiveOrder} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                In
              </Button>
              <Button type="button" variant="secondary" onClick={() => setActiveOrder(null)}>
                Đóng
              </Button>
            </div>
          </div>

          <div className="hidden print:block">
            <h2 className="text-xl font-bold">Đơn nhập kho {activeOrder.orderNumber}</h2>
            <p>Trạng thái: {orderStatusLabels[activeOrder.status]?.label ?? activeOrder.status}</p>
            <p>Nhà cung cấp: {getSupplierName(activeOrder.supplierId)}</p>
            <p>Chi nhánh: {getBranchName(activeOrder.branchId)}</p>
            <p>Ghi chú: {activeOrder.notes || '—'}</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-700">Thông tin đơn</h4>
            <div className="grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-2 print:bg-transparent">
              <div>
                <p className="text-sm text-slate-500">Nhà cung cấp</p>
                <p className="font-semibold flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {getSupplierName(activeOrder.supplierId)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Chi nhánh</p>
                <p className="font-semibold flex items-center gap-2 mt-0.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {getBranchName(activeOrder.branchId)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tổng tiền</p>
                <p className="font-semibold text-emerald-600 mt-0.5">
                  {formatCurrency(activeOrder.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ghi chú</p>
                <p className="text-sm text-slate-600 mt-0.5">{activeOrder.notes || '—'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold text-slate-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Danh sách sản phẩm
            </h4>
            <DataTable
              columns={itemsColumns}
              data={activeOrder.items ?? []}
              rowKey={(_, index) => `${activeOrder.id}-${index}`}
              isLoading={false}
              emptyTitle="Không có mặt hàng"
              emptyDescription="Đơn này chưa có chi tiết sản phẩm."
            />
          </div>
        </div>
      )}

      {/* Receive Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmReceive}
        title="Xác nhận nhận hàng"
        message={`Bạn có chắc muốn nhận hàng từ đơn ${confirmReceive?.orderNumber}?`}
        onConfirm={handleReceive}
        onCancel={() => setConfirmReceive(null)}
        isLoading={receiveMutation.isPending}
        confirmLabel="Nhận hàng"
        variant="primary"
      />
    </div>
  );
}