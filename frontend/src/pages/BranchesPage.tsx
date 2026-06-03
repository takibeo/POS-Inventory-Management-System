import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import branchService from '../services/branchService';
import type { Branch } from '../types/branch';

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
  const [message, setMessage] = useState<string | null>(null);

  const { data: branches, isLoading, isError } = useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: branchService.getBranches,
  });

  const createMutation = useMutation({
    mutationFn: branchService.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      reset(defaultValues);
      setEditingBranch(null);
      setMessage('Tạo chi nhánh thành công.');
    },
    onError: () => {
      setMessage('Không thể tạo chi nhánh. Vui lòng thử lại.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, branch }: { id: string; branch: BranchFormValues }) =>
      branchService.updateBranch(id, branch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      reset(defaultValues);
      setEditingBranch(null);
      setMessage('Cập nhật chi nhánh thành công.');
    },
    onError: () => {
      setMessage('Không thể cập nhật chi nhánh. Vui lòng thử lại.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: branchService.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      setMessage('Xóa chi nhánh thành công.');
    },
    onError: () => {
      setMessage('Không thể xóa chi nhánh. Vui lòng thử lại.');
    },
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
    setMessage(null);
  };

  const handleCancel = () => {
    setEditingBranch(null);
    reset(defaultValues);
    setMessage(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa chi nhánh này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quản lý chi nhánh</h2>
          <p className="text-sm text-slate-500">Tạo, sửa và xóa chi nhánh.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{editingBranch ? 'Sửa chi nhánh' : 'Thêm chi nhánh mới'}</h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Tên chi nhánh</label>
              <input
                type="text"
                {...register('name', { required: 'Tên chi nhánh là bắt buộc' })}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Mã chi nhánh</label>
              <input
                type="text"
                {...register('code', { required: 'Mã chi nhánh là bắt buộc' })}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Điện thoại</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingBranch ? 'Cập nhật' : 'Tạo chi nhánh'}
              </button>
              {editingBranch && (
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
          <h3 className="text-lg font-semibold mb-4">Danh sách chi nhánh</h3>

          {isLoading && <p>Đang tải chi nhánh...</p>}
          {isError && <p className="text-sm text-red-600">Không thể tải danh sách chi nhánh.</p>}

          {branches && branches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Tên</th>
                    <th className="px-4 py-3">Mã</th>
                    <th className="px-4 py-3">Địa chỉ</th>
                    <th className="px-4 py-3">Điện thoại</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {branches.map((branch) => (
                    <tr key={branch.id}>
                      <td className="px-4 py-3">{branch.name}</td>
                      <td className="px-4 py-3">{branch.code}</td>
                      <td className="px-4 py-3">{branch.address ?? '—'}</td>
                      <td className="px-4 py-3">{branch.phone ?? '—'}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(branch)}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(branch.id)}
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
            !isLoading && <p>Chưa có chi nhánh nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
