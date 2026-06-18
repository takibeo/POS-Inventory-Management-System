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
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

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
  };

  const handleCancel = () => {
    setEditingBranch(null);
    reset(defaultValues);
  };

  const columns: DataTableColumn<Branch>[] = [
    { key: 'name', header: 'Tên' },
    { key: 'code', header: 'Mã' },
    { key: 'address', header: 'Địa chỉ', render: (row) => row.address ?? '—' },
    { key: 'phone', header: 'Điện thoại', render: (row) => row.phone ?? '—' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý chi nhánh" description="Tạo, sửa và xóa chi nhánh." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">
            {editingBranch ? 'Sửa chi nhánh' : 'Thêm chi nhánh mới'}
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="ui-label">Tên chi nhánh</label>
              <input
                type="text"
                {...register('name', { required: 'Tên chi nhánh là bắt buộc' })}
                className="ui-input"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="ui-label">Mã chi nhánh</label>
              <input
                type="text"
                {...register('code', { required: 'Mã chi nhánh là bắt buộc' })}
                className="ui-input"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
            </div>

            <div>
              <label className="ui-label">Địa chỉ</label>
              <input type="text" {...register('address')} className="ui-input" />
            </div>

            <div>
              <label className="ui-label">Điện thoại</label>
              <input type="text" {...register('phone')} className="ui-input" />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {editingBranch ? 'Cập nhật' : 'Tạo chi nhánh'}
              </Button>
              {editingBranch && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Danh sách chi nhánh</h3>
          <DataTable
            columns={columns}
            data={branches ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={isError ? 'Không thể tải danh sách chi nhánh.' : null}
            emptyTitle="Chưa có chi nhánh"
            emptyDescription="Thêm chi nhánh mới bằng form bên trái."
            renderActions={(branch) => (
              <TableRowActions
                onEdit={() => handleEdit(branch)}
                onDelete={() => setDeleteTarget(branch)}
              />
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xóa chi nhánh"
        message={`Bạn có chắc muốn xóa chi nhánh "${deleteTarget?.name}"?`}
        confirmLabel="Xóa"
        isLoading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
