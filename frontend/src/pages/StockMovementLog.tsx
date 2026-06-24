import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import { useBranchContext } from '../contexts/BranchContext';
import inventoryService from '../services/inventoryService';

type InventoryTransactionRow = {
  id: string;
  date: string;
  product: string;
  transactionType: string;
  quantity: number;
  remark?: string;
  branch: string;
};

const transactionTypeOptions = ['ALL', 'PURCHASE', 'SALE', 'ADJUSTMENT'] as const;

function downloadCsv(filename: string, rows: InventoryTransactionRow[]) {
  const header = ['Date', 'Product', 'Transaction Type', 'Quantity', 'Remark', 'Branch'];
  const csv = [
    header.join(','),
    ...rows.map((row) =>
      [row.date, row.product, row.transactionType, row.quantity, row.remark ?? '', row.branch]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StockMovementLog() {
  const { selectedBranchId, branches } = useBranchContext();
  const [productFilter, setProductFilter] = useState('');
  const [transactionType, setTransactionType] = useState<(typeof transactionTypeOptions)[number]>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const branchName = useMemo(
    () => branches.find((b) => b.id === selectedBranchId)?.name ?? '—',
    [branches, selectedBranchId]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory-transactions', selectedBranchId],
    queryFn: async () => {
      if (!selectedBranchId) return [];
      return inventoryService.getTransactionsByBranch(selectedBranchId);
    },
    enabled: !!selectedBranchId,
  });

  const rows: InventoryTransactionRow[] = (data ?? []).map((tx: any) => ({
    id: tx.id,
    date: tx.createdAt,
    product: tx.inventory?.product?.name ?? '—',
    transactionType: tx.transactionType,
    quantity: tx.quantity,
    remark: tx.remark,
    branch: tx.inventory?.branch?.name ?? branchName,
  }));

  const filteredRows = rows
    .filter((row) => {
      const matchesProduct = row.product.toLowerCase().includes(productFilter.toLowerCase());
      const matchesType = transactionType === 'ALL' || row.transactionType === transactionType;
      const rowDate = row.date ? new Date(row.date).getTime() : 0;
      const matchesFrom = !fromDate || rowDate >= new Date(fromDate).getTime();
      const matchesTo = !toDate || rowDate <= new Date(toDate).getTime();
      return matchesProduct && matchesType && matchesFrom && matchesTo;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const columns: DataTableColumn<InventoryTransactionRow>[] = [
    { key: 'date', header: 'Ngày', render: (r) => new Date(r.date).toLocaleString('vi-VN') },
    { key: 'product', header: 'Sản phẩm' },
    { key: 'transactionType', header: 'Loại giao dịch' },
    { key: 'quantity', header: 'Số lượng' },
    { key: 'remark', header: 'Ghi chú', render: (r) => r.remark ?? '—' },
    { key: 'branch', header: 'Chi nhánh' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Lịch sử tồn kho" description="Theo dõi nhập, bán và điều chỉnh tồn kho theo chi nhánh." />

      <div className="ui-card space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            className="ui-input"
            placeholder="Lọc theo sản phẩm"
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          />
          <select
            className="ui-input"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as typeof transactionType)}
          >
            {transactionTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input className="ui-input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input className="ui-input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => downloadCsv('stock-movement.csv', filteredRows)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setProductFilter('');
              setTransactionType('ALL');
              setFromDate('');
              setToDate('');
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Xoá lọc
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filteredRows}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={isError ? 'Không thể tải lịch sử tồn kho.' : null}
          emptyTitle="Chưa có giao dịch"
          emptyDescription="Lịch sử tồn kho sẽ hiển thị ở đây."
        />
      </div>
    </div>
  );
}
