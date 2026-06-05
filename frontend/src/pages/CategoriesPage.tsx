import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Button,
  ConfirmModal,
  DataTable,
  type DataTableColumn,
  PageHeader,
  TableRowActions,
} from '../components/ui';
import categoryService from '../services/categoryService';
import type { Category } from '../types/category';

type CategoryFormValues = {
  name: string;
  description?: string;
};

const defaultValues: CategoryFormValues = {
  name: '',
  description: '',
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data: categories, isLoading, isError } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset(defaultValues);
      setEditingCategory(null);
      toast.success('Tạo danh mục thành công.');
    },
    onError: () => toast.error('Không thể tạo danh mục.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, category }: { id: string; category: CategoryFormValues }) =>
      categoryService.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset(defaultValues);
      setEditingCategory(null);
      toast.success('Cập nhật danh mục thành công.');
    },
    onError: () => toast.error('Không thể cập nhật danh mục.'),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteTarget(null);
      toast.success('Xóa danh mục thành công.');
    },
    onError: () => toast.error('Không thể xóa danh mục.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ defaultValues });

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, category: values });
      return;
    }
    createMutation.mutate(values);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description ?? '');
  };

  const handleCancel = () => {
    setEditingCategory(null);
    reset(defaultValues);
  };

  const columns: DataTableColumn<Category>[] = [
    { key: 'name', header: 'Tên' },
    { key: 'description', header: 'Mô tả', render: (row) => row.description ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý danh mục"
        description="Tạo, sửa và xóa danh mục sản phẩm."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">
            {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="ui-label">Tên danh mục</label>
              <input
                type="text"
                {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                className="ui-input"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="ui-label">Mô tả</label>
              <textarea rows={4} {...register('description')} className="ui-input" />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
              </Button>
              {editingCategory && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Danh sách danh mục</h3>
          <DataTable
            columns={columns}
            data={categories ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách danh mục.' : null}
            emptyTitle="Chưa có danh mục"
            emptyDescription="Thêm danh mục mới bằng form bên trái."
            renderActions={(category) => (
              <TableRowActions
                onEdit={() => handleEdit(category)}
                onDelete={() => setDeleteTarget(category)}
              />
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"?`}
        confirmLabel="Xóa"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
