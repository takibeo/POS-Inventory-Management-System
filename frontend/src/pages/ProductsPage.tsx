import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { z } from 'zod';
import {
  Button,
  ConfirmModal,
  DataTable,
  EmptyState,
  LoadingSpinner,
  type DataTableColumn,
  PageHeader,
  TableRowActions,
} from '../components/ui';
import categoryService from '../services/categoryService';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import type { Product, ProductFormValues } from '../types/product';
import { 
  Plus, 
  Search, 
  Download, 
  RefreshCw, 
  Package, 
  Tag, 
  DollarSign, 
  Layers,
  Box,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU là bắt buộc'),
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  price: z.coerce.number().min(0, 'Giá bán phải ≥ 0'),
  cost: z.coerce.number().min(0, 'Giá vốn phải ≥ 0'),
  unit: z.string().optional(),
  reorderLevel: z.coerce.number().min(0).optional(),
  isActive: z.boolean(),
});

const defaultValues: ProductFormValues = {
  sku: '',
  name: '',
  description: '',
  categoryId: '',
  supplierId: '',
  price: 0,
  cost: 0,
  unit: '',
  reorderLevel: 0,
  isActive: true,
};

const formatCurrency = (value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [detailTarget, setDetailTarget] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: products, isLoading, error, refetch } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productService.getProducts,
    retry: false,
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    retry: false,
  });

  const { data: suppliers, isLoading: suppliersLoading, isError: suppliersError } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      setShowForm(false);
      toast.success('Tạo sản phẩm thành công.');
    },
    onError: () => toast.error('Không thể tạo sản phẩm.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductFormValues }) =>
      productService.updateProduct(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      setShowForm(false);
      toast.success('Cập nhật sản phẩm thành công.');
    },
    onError: () => toast.error('Không thể cập nhật sản phẩm.'),
  });

  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteTarget(null);
      toast.success('Xóa sản phẩm thành công.');
    },
    onError: () => toast.error('Không thể xóa sản phẩm.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ defaultValues });

  const resetForm = () => {
    setEditingProduct(null);
    reset(defaultValues);
  };

  const onSubmit = (values: ProductFormValues) => {
    const parsed = productSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ProductFormValues;
        if (field) setError(field, { message: issue.message });
      });
      return;
    }

    const payload: ProductFormValues = {
      ...parsed.data,
      categoryId: parsed.data.categoryId || undefined,
      supplierId: parsed.data.supplierId || undefined,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, values: payload });
      return;
    }
    createMutation.mutate(payload);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue('sku', product.sku);
    setValue('name', product.name);
    setValue('description', product.description ?? '');
    setValue('categoryId', product.category?.id ?? product.categoryId ?? '');
    setValue('supplierId', product.supplier?.id ?? product.supplierId ?? '');
    setValue('price', product.price);
    setValue('cost', product.cost);
    setValue('unit', product.unit ?? '');
    setValue('reorderLevel', product.reorderLevel ?? 0);
    setValue('isActive', product.isActive ?? true);
    setShowForm(true);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const escapeCsvValue = (value: unknown) => `"${String(value).split('"').join('""')}"`;

  const exportCsv = () => {
    const header = ['SKU', 'Name', 'Price', 'Cost', 'Unit', 'Status'];
    const csv = [
      header.join(','),
      ...(filteredProducts ?? []).map((row) =>
        [row.sku, row.name, row.price, row.cost, row.unit ?? '', row.isActive ? 'Active' : 'Inactive']
          .map(escapeCsvValue)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products ?? [];
    return (products ?? []).filter((row) =>
      row.sku.toLowerCase().includes(keyword) || row.name.toLowerCase().includes(keyword) || (row.unit ?? '').toLowerCase().includes(keyword)
    );
  }, [products, search]);

  const columns: DataTableColumn<Product>[] = [
    { 
      key: 'sku', 
      header: 'SKU',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
          {row.sku}
        </span>
      )
    },
    { 
      key: 'name', 
      header: 'Tên sản phẩm',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            {row.description && (
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{row.description}</p>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'price', 
      header: 'Giá bán', 
      render: (row) => (
        <span className="font-semibold text-emerald-600">{formatCurrency(row.price)}</span>
      )
    },
    { 
      key: 'cost', 
      header: 'Giá vốn', 
      render: (row) => (
        <span className="text-slate-600">{formatCurrency(row.cost)}</span>
      )
    },
    { 
      key: 'unit', 
      header: 'Đơn vị', 
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full">
          <Box className="w-3 h-3" />
          {row.unit ?? '—'}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {row.isActive ? 'Hoạt động' : 'Ngừng'}
        </span>
      ),
    },
  ];

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
              Quản lý sản phẩm
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Quản lý danh sách sản phẩm trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {products?.length || 0} sản phẩm
            </span>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="ui-input pl-9" 
            placeholder="Tìm kiếm theo SKU, tên hoặc đơn vị..." 
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={exportCsv} 
            disabled={filteredProducts.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* Form Section */}
        {showForm && (
          <div className="ui-card relative">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            
            <div className="flex items-center gap-2 mb-5">
              <div className={`p-2 rounded-lg ${editingProduct ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {editingProduct ? (
                  <Edit className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input type="text" {...register('sku')} className="ui-input" placeholder="SP001" />
                  {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
                </div>
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input type="text" {...register('name')} className="ui-input" placeholder="Tên sản phẩm" />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
              </div>

              <div>
                <label className="ui-label">Mô tả</label>
                <textarea rows={2} {...register('description')} className="ui-input" placeholder="Mô tả sản phẩm..." />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    Giá bán
                  </label>
                  <input type="number" min="0" step="1000" inputMode="decimal" {...register('price')} className="ui-input" placeholder="0" />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="ui-label">Giá vốn</label>
                  <input type="number" min="0" step="1000" inputMode="decimal" {...register('cost')} className="ui-input" placeholder="0" />
                  {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Box className="w-3.5 h-3.5" />
                    Đơn vị
                  </label>
                  <input type="text" {...register('unit')} className="ui-input" placeholder="cái, hộp, kg..." />
                </div>
                <div>
                  <label className="ui-label">Mức đặt lại</label>
                  <input type="number" min="0" inputMode="numeric" {...register('reorderLevel')} className="ui-input" placeholder="0" />
                  {errors.reorderLevel && <p className="mt-1 text-sm text-red-600">{errors.reorderLevel.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Danh mục
                  </label>
                  <select {...register('categoryId')} className="ui-input" disabled={categoriesLoading || categoriesError}>
                    <option value="">— Không chọn —</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="ui-label">Nhà cung cấp</label>
                  <select {...register('supplierId')} className="ui-input" disabled={suppliersLoading || suppliersError}>
                    <option value="">— Không chọn —</option>
                    {suppliers?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="select-none">Đang hoạt động</span>
              </label>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? 'Cập nhật' : 'Tạo sản phẩm'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}>
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Table Section */}
        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Danh sách sản phẩm</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị {filteredProducts.length} / {products?.length || 0} sản phẩm
              </p>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <EmptyState
              variant="error"
              title="Không thể tải danh sách sản phẩm"
              description="Kiểm tra kết nối API hoặc thử tải lại danh sách."
              action={
                <Button type="button" variant="secondary" onClick={() => refetch()}>
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredProducts}
              rowKey={(row) => row.id}
              isLoading={false}
              error={null}
              emptyTitle="Chưa có sản phẩm"
              emptyDescription="Nhấn 'Thêm sản phẩm' để tạo sản phẩm đầu tiên."
              renderActions={(product) => (
                <TableRowActions
                  onEdit={() => handleEdit(product)}
                  onDelete={() => setDeleteTarget(product)}
                extraActions={[
                    { 
                      label: 'Xem chi tiết', 
                      onClick: () => setDetailTarget(product), 
                      variant: 'ghost',
                    },
                  ]}
                />
              )}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />

      {/* Detail Modal */}
      <ConfirmModal
        isOpen={!!detailTarget}
        title="Chi tiết sản phẩm"
        message={detailTarget ? 
          `📦 ${detailTarget.name}\n\n` +
          `SKU: ${detailTarget.sku}\n` +
          `Giá bán: ${formatCurrency(detailTarget.price)}\n` +
          `Giá vốn: ${formatCurrency(detailTarget.cost)}\n` +
          `Đơn vị: ${detailTarget.unit ?? '—'}\n` +
          `Danh mục: ${detailTarget.category?.name ?? '—'}\n` +
          `Nhà cung cấp: ${detailTarget.supplier?.name ?? '—'}\n` +
          `Mức đặt lại: ${detailTarget.reorderLevel ?? 0}\n` +
          `Trạng thái: ${detailTarget.isActive ? '✅ Hoạt động' : '❌ Ngừng'}` 
          : ''
        }
        confirmLabel="Đóng"
        variant="primary"
        onConfirm={() => setDetailTarget(null)}
        onCancel={() => setDetailTarget(null)}
      />
    </div>
  );
}