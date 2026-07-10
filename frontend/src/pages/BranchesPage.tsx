import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Button,
  ConfirmModal,
  DataTable,
  EmptyState,
  type DataTableColumn,
  PageHeader,
  TableRowActions,
} from '../components/ui';
import branchService from '../services/branchService';
import type { Branch } from '../types/branch';
import { 
  Plus, 
  Building2, 
  MapPin, 
  Phone, 
  Edit, 
  Trash2, 
  X,
  Hash,
  RefreshCw
} from 'lucide-react';

type BranchFormValues = {
  name: string;
  code: string;
  address?: string;
  phone?: string;
};

const defaultValues: BranchFormValues = {
  name: '',
  code: '',
  address: '',
  phone: '',
};

export default function BranchesPage() {
  const queryClient = useQueryClient();
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: branches, isLoading, isError, refetch } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: branchService.getBranches,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      reset(defaultValues);
      setEditingBranch(null);
      setShowForm(false);
      toast.success('Tạo chi nhánh thành công.');
    },
    onError: () => toast.error('Không thể tạo chi nhánh.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, branch }: { id: string; branch: BranchFormValues }) =>
      branchService.updateBranch(id, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      reset(defaultValues);
      setEditingBranch(null);
      setShowForm(false);
      toast.success('Cập nhật chi nhánh thành công.');
    },
    onError: () => toast.error('Không thể cập nhật chi nhánh.'),
  });

  const deleteMutation = useMutation({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setDeleteTarget(null);
      toast.success('Xóa chi nhánh thành công.');
    },
    onError: () => toast.error('Không thể xóa chi nhánh.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({ defaultValues });

  const onSubmit = (values: BranchFormValues) => {
    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, branch: values });
      return;
    }

    createMutation.mutate(values);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setValue('name', branch.name);
    setValue('code', branch.code);
    setValue('address', branch.address ?? '');
    setValue('phone', branch.phone ?? '');
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    reset(defaultValues);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingBranch(null);
    reset(defaultValues);
    setShowForm(false);
  };

  const columns: DataTableColumn<Branch>[] = [
    { 
      key: 'name', 
      header: 'Tên chi nhánh',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.code}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'code', 
      header: 'Mã',
      render: (row) => (
        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
          {row.code}
        </span>
      )
    },
    { 
      key: 'address', 
      header: 'Địa chỉ', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{row.address ?? '—'}</span>
        </div>
      )
    },
    { 
      key: 'phone', 
      header: 'Điện thoại', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{row.phone ?? '—'}</span>
        </div>
      )
    },
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
              <Building2 className="w-6 h-6" />
              Quản lý chi nhánh
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Quản lý danh sách chi nhánh trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {branches?.length || 0} chi nhánh
            </span>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-emerald-700 hover:text-emerald-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4" />
              Thêm chi nhánh
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
              <div className={`p-2 rounded-lg ${editingBranch ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {editingBranch ? (
                  <Edit className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingBranch ? 'Sửa chi nhánh' : 'Thêm chi nhánh mới'}
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="ui-label flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Tên chi nhánh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Tên chi nhánh là bắt buộc' })}
                  className="ui-input"
                  placeholder="Nhập tên chi nhánh..."
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="ui-label flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  Mã chi nhánh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('code', { required: 'Mã chi nhánh là bắt buộc' })}
                  className="ui-input"
                  placeholder="CN001"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
              </div>

              <div>
                <label className="ui-label flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Địa chỉ
                </label>
                <input 
                  type="text" 
                  {...register('address')} 
                  className="ui-input" 
                  placeholder="Nhập địa chỉ chi nhánh..."
                />
              </div>

              <div>
                <label className="ui-label flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  Điện thoại
                </label>
                <input 
                  type="text" 
                  {...register('phone')} 
                  className="ui-input" 
                  placeholder="Nhập số điện thoại..."
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {editingBranch ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tạo chi nhánh
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
              <h3 className="text-lg font-semibold text-slate-900">Danh sách chi nhánh</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tổng {branches?.length || 0} chi nhánh
              </p>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>

          {isError ? (
            <EmptyState
              variant="error"
              title="Không thể tải danh sách chi nhánh"
              description="Vui lòng kiểm tra API branches rồi thử lại."
              action={
                <Button type="button" variant="secondary" onClick={() => refetch()}>
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={branches ?? []}
              rowKey={(row) => row.id}
              isLoading={isLoading}
              emptyTitle="Chưa có chi nhánh"
              emptyDescription="Nhấn 'Thêm chi nhánh' để tạo chi nhánh đầu tiên."
              renderActions={(branch) => (
                <TableRowActions
                  onEdit={() => handleEdit(branch)}
                  onDelete={() => setDeleteTarget(branch)}
                />
              )}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa chi nhánh"
        message={`Bạn có chắc muốn xóa chi nhánh "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}