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
import { 
  Plus, 
  Layers, 
  Tag, 
  Edit, 
  Trash2, 
  X,
  FolderTree,
  FileText
} from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
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
      setShowForm(false);
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
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    reset(defaultValues);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    reset(defaultValues);
    setShowForm(false);
  };

  const columns: DataTableColumn<Category>[] = [
    { 
      key: 'name', 
      header: 'Tên danh mục',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderTree className="w-4 h-4 text-indigo-600" />
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
      key: 'description', 
      header: 'Mô tả', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{row.description ?? '—'}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6" />
              Quản lý danh mục
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Quản lý danh mục sản phẩm trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {categories?.length || 0} danh mục
            </span>
            <Button 
              type="button" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2 shadow-lg hover:shadow-emerald-200/50 transition-all duration-200 font-medium"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4" />
              Thêm danh mục
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Form Section */}
        {showForm && (
          <div className="ui-card relative">
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
            
            <div className="flex items-center gap-2 mb-5">
              <div className={`p-2 rounded-lg ${editingCategory ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {editingCategory ? (
                  <Edit className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="ui-label flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                  className="ui-input"
                  placeholder="Nhập tên danh mục..."
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="ui-label flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Mô tả
                </label>
                <textarea 
                  rows={4} 
                  {...register('description')} 
                  className="ui-input" 
                  placeholder="Nhập mô tả danh mục..."
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {editingCategory ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tạo danh mục
                    </>
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
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
              <h3 className="text-lg font-semibold text-slate-900">Danh sách danh mục</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tổng {categories?.length || 0} danh mục
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={categories ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách danh mục.' : null}
            emptyTitle="Chưa có danh mục"
            emptyDescription="Nhấn 'Thêm danh mục' để tạo danh mục đầu tiên."
            renderActions={(category) => (
              <TableRowActions
                onEdit={() => handleEdit(category)}
                onDelete={() => setDeleteTarget(category)}
              />
            )}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}