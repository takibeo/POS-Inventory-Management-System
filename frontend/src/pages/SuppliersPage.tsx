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
import supplierService from '../services/supplierService';
import type { Supplier } from '../types/supplier';
import { 
  Plus, 
  Users, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Edit,
  X,
  RefreshCw,
  Building2
} from 'lucide-react';

type SupplierFormValues = {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
};

const defaultValues: SupplierFormValues = {
  name: '',
  contactName: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
};

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: suppliers, isLoading, isError, refetch } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset(defaultValues);
      setEditingSupplier(null);
      setShowForm(false);
      toast.success('Tạo nhà cung cấp thành công.');
    },
    onError: () => toast.error('Không thể tạo nhà cung cấp.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, supplier }: { id: string; supplier: SupplierFormValues }) =>
      supplierService.updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset(defaultValues);
      setEditingSupplier(null);
      setShowForm(false);
      toast.success('Cập nhật nhà cung cấp thành công.');
    },
    onError: () => toast.error('Không thể cập nhật nhà cung cấp.'),
  });

  const deleteMutation = useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDeleteTarget(null);
      toast.success('Xóa nhà cung cấp thành công.');
    },
    onError: () => toast.error('Không thể xóa nhà cung cấp.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({ defaultValues });

  const onSubmit = (values: SupplierFormValues) => {
    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, supplier: values });
      return;
    }
    createMutation.mutate(values);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setValue('name', supplier.name);
    setValue('contactName', supplier.contactName ?? '');
    setValue('phone', supplier.phone ?? '');
    setValue('email', supplier.email ?? '');
    setValue('address', supplier.address ?? '');
    setValue('notes', supplier.notes ?? '');
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    reset(defaultValues);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    reset(defaultValues);
    setShowForm(false);
  };

  const columns: DataTableColumn<Supplier>[] = [
    { 
      key: 'name', 
      header: 'Tên nhà cung cấp',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            {row.contactName && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3" />
                {row.contactName}
              </p>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'contactName', 
      header: 'Người liên hệ', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{row.contactName ?? '—'}</span>
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
    { 
      key: 'email', 
      header: 'Email', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600">{row.email ?? '—'}</span>
        </div>
      )
    },
    { 
      key: 'address', 
      header: 'Địa chỉ', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 truncate max-w-[150px]">{row.address ?? '—'}</span>
        </div>
      )
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
              <Users className="w-6 h-6" />
              Quản lý nhà cung cấp
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Quản lý danh sách nhà cung cấp trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
              {suppliers?.length || 0} nhà cung cấp
            </span>
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4" />
              Thêm nhà cung cấp
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
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
              <div className={`p-2 rounded-lg ${editingSupplier ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                {editingSupplier ? (
                  <Edit className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
              </h3>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="ui-label flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Tên nhà cung cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Tên nhà cung cấp là bắt buộc' })}
                  className="ui-input"
                  placeholder="Nhập tên nhà cung cấp..."
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    Người liên hệ
                  </label>
                  <input 
                    type="text" 
                    {...register('contactName')} 
                    className="ui-input" 
                    placeholder="Tên người liên hệ..."
                  />
                </div>
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    Số điện thoại
                  </label>
                  <input 
                    type="text" 
                    {...register('phone')} 
                    className="ui-input" 
                    placeholder="Số điện thoại..."
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="ui-label flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </label>
                  <input 
                    type="email" 
                    {...register('email')} 
                    className="ui-input" 
                    placeholder="email@example.com..."
                  />
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
                    placeholder="Địa chỉ..."
                  />
                </div>
              </div>

              <div>
                <label className="ui-label flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Ghi chú
                </label>
                <textarea 
                  rows={3} 
                  {...register('notes')} 
                  className="ui-input" 
                  placeholder="Ghi chú thêm về nhà cung cấp..."
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {editingSupplier ? (
                    <>
                      <Edit className="w-4 h-4" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Tạo nhà cung cấp
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
              <h3 className="text-lg font-semibold text-slate-900">Danh sách nhà cung cấp</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tổng {suppliers?.length || 0} nhà cung cấp
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
              title="Không thể tải danh sách nhà cung cấp"
              description="Vui lòng kiểm tra API suppliers rồi thử lại."
              action={
                <Button type="button" variant="secondary" onClick={() => refetch()}>
                  Thử lại
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={suppliers ?? []}
              rowKey={(row) => row.id}
              isLoading={isLoading}
              emptyTitle="Chưa có nhà cung cấp"
              emptyDescription="Nhấn 'Thêm nhà cung cấp' để tạo nhà cung cấp đầu tiên."
              renderActions={(supplier) => (
                <TableRowActions
                  onEdit={() => handleEdit(supplier)}
                  onDelete={() => setDeleteTarget(supplier)}
                />
              )}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa nhà cung cấp"
        message={`Bạn có chắc muốn xóa nhà cung cấp "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}