import type { ReactNode } from 'react';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  renderActions?: (row: T) => ReactNode;
  pagination?: PaginationProps;
};

export default function DataTable<T>({
                                       columns,
                                       data,
                                       rowKey,
                                       isLoading = false,
                                       error = null,
                                       emptyTitle,
                                       emptyDescription,
                                       emptyAction,
                                       renderActions,
                                       pagination,
                                     }: DataTableProps<T>) {
  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
        <EmptyState
            variant="error"
            title="Không thể tải dữ liệu"
            description={error}
        />
    );
  }

  if (data.length === 0) {
    return (
        <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
        />
    );
  }

  const allColumns = renderActions
      ? [...columns, { key: '__actions', header: 'Hành động', className: 'whitespace-nowrap' }]
      : columns;

  return (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
            <tr>
              {allColumns.map((col) => (
                  <th key={col.key}
                      className={`px-4 py-3 font-medium ${col.className ?? ''}`}>
                    {col.header}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row, index) => (
                <tr key={rowKey(row, index)} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col) => (
                      <td key={col.key}
                          className={`px-4 py-3 text-slate-800 ${col.className ?? ''}`}>
                        {col.render
                            ? col.render(row)
                            : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                  ))}
                  {renderActions && (
                      <td className="px-4 py-3">{renderActions(row)}</td>
                  )}
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-slate-500">
                Trang {pagination.page + 1} / {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                    onClick={() => pagination.onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm
                font-medium text-slate-700 transition hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Trước
                </button>
                <button
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm
                font-medium text-slate-700 transition hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Tiếp →
                </button>
              </div>
            </div>
        )}
      </div>
  );
}