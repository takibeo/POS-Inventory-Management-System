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
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Tên' },
    { key: 'price', header: 'Giá bán', render: (row) => formatCurrency(row.price) },
    { key: 'cost', header: 'Giá vốn', render: (row) => formatCurrency(row.cost) },
    { key: 'unit', header: 'Đơn vị', render: (row) => row.unit ?? '—' },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (row) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${row.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
          {row.isActive ? 'Hoạt động' : 'Ngừng'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý sản phẩm" description="Tạo, sửa và xóa sản phẩm trong hệ thống." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="ui-input sm:max-w-sm" placeholder="Tìm theo SKU, tên hoặc đơn vị" />
        <Button type="button" variant="secondary" onClick={exportCsv} disabled={filteredProducts.length === 0}>Export CSV</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="ui-label">SKU</label>
              <input type="text" {...register('sku')} className="ui-input" />
              {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
            </div>
            <div>
              <label className="ui-label">Tên sản phẩm</label>
              <input type="text" {...register('name')} className="ui-input" />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="ui-label">Mô tả</label>
              <textarea rows={3} {...register('description')} className="ui-input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="ui-label">Giá bán</label>
                <input type="number" min="0" step="1000" inputMode="decimal" {...register('price')} className="ui-input" />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>
              <div>
                <label className="ui-label">Giá vốn</label>
                <input type="number" min="0" step="1000" inputMode="decimal" {...register('cost')} className="ui-input" />
                {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="ui-label">Đơn vị</label>
                <input type="text" {...register('unit')} className="ui-input" placeholder="cái, hộp..." />
              </div>
              <div>
                <label className="ui-label">Mức đặt lại</label>
                <input type="number" min="0" inputMode="numeric" {...register('reorderLevel')} className="ui-input" />
                {errors.reorderLevel && <p className="mt-1 text-sm text-red-600">{errors.reorderLevel.message}</p>}
              </div>
            </div>
            <div>
              <label className="ui-label">Danh mục</label>
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
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register('isActive')} className="rounded border-slate-300" />
              Đang hoạt động
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                {editingProduct ? 'Cập nhật' : 'Tạo sản phẩm'}
              </Button>
              {editingProduct && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="ui-card">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
            {!isLoading && (
              <Button type="button" variant="ghost" onClick={() => refetch()}>
                Làm mới
              </Button>
            )}
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
              emptyDescription="Thêm sản phẩm mới bằng form bên trái."
              renderActions={(product) => (
                <TableRowActions
                  onEdit={() => handleEdit(product)}
                  onDelete={() => setDeleteTarget(product)}
                  extraActions={[
                    { label: 'Xem', onClick: () => setDetailTarget(product), variant: 'ghost' },
                  ]}
                />
              )}
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa sản phẩm "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />

      <ConfirmModal
        isOpen={!!detailTarget}
        title="Chi tiết sản phẩm"
        message={detailTarget ? `SKU: ${detailTarget.sku}\nTên: ${detailTarget.name}\nGiá bán: ${formatCurrency(detailTarget.price)}\nGiá vốn: ${formatCurrency(detailTarget.cost)}\nĐơn vị: ${detailTarget.unit ?? '—'}\nTrạng thái: ${detailTarget.isActive ? 'Hoạt động' : 'Ngừng'}` : ''}
        confirmLabel="Đóng"
        variant="primary"
        onConfirm={() => setDetailTarget(null)}
        onCancel={() => setDetailTarget(null)}
      />
    </div>
  );
}
