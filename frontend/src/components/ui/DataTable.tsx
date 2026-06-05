import type { ReactNode } from 'react';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  renderActions?: (row: T) => ReactNode;
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
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  }

  if (data.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }

  const allColumns = renderActions
    ? [...columns, { key: '__actions', header: 'Hành động', className: 'whitespace-nowrap' }]
    : columns;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {allColumns.map((column) => (
              <th key={column.key} className={`px-4 py-3 font-medium ${column.className ?? ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-slate-50/80">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 text-slate-800 ${column.className ?? ''}`}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '—')}
                </td>
              ))}
              {renderActions && <td className="px-4 py-3">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
