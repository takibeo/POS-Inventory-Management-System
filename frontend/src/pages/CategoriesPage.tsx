import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage('Tạo danh mục thành công.');
    },
    onError: () => {
      setMessage('Không thể tạo danh mục. Vui lòng thử lại.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, category }: { id: string; category: CategoryFormValues }) =>
      categoryService.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      reset(defaultValues);
      setEditingCategory(null);
      setMessage('Cập nhật danh mục thành công.');
    },
    onError: () => {
      setMessage('Không thể cập nhật danh mục. Vui lòng thử lại.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setMessage('Xóa danh mục thành công.');
    },
    onError: () => {
      setMessage('Không thể xóa danh mục. Vui lòng thử lại.');
    },
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
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    reset(defaultValues);
    setMessage(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quản lý danh mục</h2>
          <p className="text-sm text-slate-500">Tạo, sửa và xóa danh mục sản phẩm.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên danh mục</label>
              <input
                type="text"
                {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                rows={4}
                {...register('description')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingCategory ? 'Cập nhật' : 'Tạo danh mục'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>

          {message && <p className="mt-4 text-sm text-slate-700">{message}</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Danh sách danh mục</h3>

          {isLoading && <p>Đang tải danh mục...</p>}
          {isError && <p className="text-sm text-red-600">Không thể tải danh sách danh mục.</p>}

          {categories && categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Tên</th>
                    <th className="px-4 py-3">Mô tả</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-4 py-3">{category.name}</td>
                      <td className="px-4 py-3">{category.description ?? '—'}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="rounded-xl border border-red-300 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !isLoading && <p>Chưa có danh mục nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
