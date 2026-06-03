import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [message, setMessage] = useState<string | null>(null);

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
      setMessage('Tạo nhà cung cấp thành công.');
    },
    onError: () => {
      setMessage('Không thể tạo nhà cung cấp. Vui lòng thử lại.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, supplier }: { id: string; supplier: SupplierFormValues }) =>
      supplierService.updateSupplier(id, supplier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset(defaultValues);
      setEditingSupplier(null);
      setMessage('Cập nhật nhà cung cấp thành công.');
    },
    onError: () => {
      setMessage('Không thể cập nhật nhà cung cấp. Vui lòng thử lại.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: supplierService.deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setMessage('Xóa nhà cung cấp thành công.');
    },
    onError: () => {
      setMessage('Không thể xóa nhà cung cấp. Vui lòng thử lại.');
    },
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
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingSupplier(null);
    reset(defaultValues);
    setMessage(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quản lý nhà cung cấp</h2>
          <p className="text-sm text-slate-500">Tạo, sửa và xóa nhà cung cấp.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên nhà cung cấp</label>
              <input
                type="text"
                {...register('name', { required: 'Tên nhà cung cấp là bắt buộc' })}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên người liên hệ</label>
              <input
                type="text"
                {...register('contactName')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Địa chỉ</label>
              <input
                type="text"
                {...register('address')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Ghi chú</label>
              <textarea
                rows={4}
                {...register('notes')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingSupplier ? 'Cập nhật' : 'Tạo nhà cung cấp'}
              </button>
              {editingSupplier && (
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
          <h3 className="text-lg font-semibold mb-4">Danh sách nhà cung cấp</h3>

          {isLoading && <p>Đang tải nhà cung cấp...</p>}
          {isError && <p className="text-sm text-red-600">Không thể tải danh sách nhà cung cấp.</p>}

          {suppliers && suppliers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Tên</th>
                    <th className="px-4 py-3">Liên hệ</th>
                    <th className="px-4 py-3">Điện thoại</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="px-4 py-3">{supplier.name}</td>
                      <td className="px-4 py-3">{supplier.contactName ?? '—'}</td>
                      <td className="px-4 py-3">{supplier.phone ?? '—'}</td>
                      <td className="px-4 py-3">{supplier.email ?? '—'}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(supplier)}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(supplier.id)}
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
            !isLoading && <p>Chưa có nhà cung cấp nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
