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
import supplierService from '../services/supplierService';
import type { Supplier } from '../types/supplier';

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

  const { data: suppliers, isLoading, isError } = useQuery<Supplier[], Error>({
    queryKey: ['suppliers'],
    queryFn: supplierService.getSuppliers,
  });

  const createMutation = useMutation({
    mutationFn: supplierService.createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset(defaultValues);
      setEditingSupplier(null);
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
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    reset(defaultValues);
  };

  const columns: DataTableColumn<Supplier>[] = [
    { key: 'name', header: 'Tên' },
    { key: 'contactName', header: 'Liên hệ', render: (row) => row.contactName ?? '—' },
    { key: 'phone', header: 'Điện thoại', render: (row) => row.phone ?? '—' },
    { key: 'email', header: 'Email', render: (row) => row.email ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý nhà cung cấp"
        description="Tạo, sửa và xóa nhà cung cấp."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">
            {editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="ui-label">Tên nhà cung cấp</label>
              <input
                type="text"
                {...register('name', { required: 'Tên nhà cung cấp là bắt buộc' })}
                className="ui-input"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="ui-label">Tên người liên hệ</label>
              <input type="text" {...register('contactName')} className="ui-input" />
            </div>

            <div>
              <label className="ui-label">Số điện thoại</label>
              <input type="text" {...register('phone')} className="ui-input" />
            </div>

            <div>
              <label className="ui-label">Email</label>
              <input type="email" {...register('email')} className="ui-input" />
            </div>

            <div>
              <label className="ui-label">Địa chỉ</label>
              <input type="text" {...register('address')} className="ui-input" />
            </div>

            <div>
              <label className="ui-label">Ghi chú</label>
              <textarea rows={4} {...register('notes')} className="ui-input" />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {editingSupplier ? 'Cập nhật' : 'Tạo nhà cung cấp'}
              </Button>
              {editingSupplier && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Danh sách nhà cung cấp</h3>
          <DataTable
            columns={columns}
            data={suppliers ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách nhà cung cấp.' : null}
            emptyTitle="Chưa có nhà cung cấp"
            emptyDescription="Thêm nhà cung cấp mới bằng form bên trái."
            renderActions={(supplier) => (
              <TableRowActions
                onEdit={() => handleEdit(supplier)}
                onDelete={() => setDeleteTarget(supplier)}
              />
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa nhà cung cấp"
        message={`Bạn có chắc muốn xóa nhà cung cấp "${deleteTarget?.name}"?`}
        confirmLabel="Xóa"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
