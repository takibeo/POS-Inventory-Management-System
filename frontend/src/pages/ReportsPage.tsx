import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import reportService from '../services/reportService';
import type { BestSeller, LowStockItem } from '../types/report';

const formatCurrency = (v: number) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

type ReportTab = 'revenue' | 'profit' | 'best-sellers' | 'low-stock';

const tabs: { key: ReportTab; label: string }[] = [
  { key: 'revenue', label: 'Doanh thu' },
  { key: 'profit', label: 'Lợi nhuận' },
  { key: 'best-sellers', label: 'Bán chạy' },
  { key: 'low-stock', label: 'Tồn kho thấp' },
];

function ApiUnavailable({ endpoint }: { endpoint: string }) {
  return (
    <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Backend chưa trả dữ liệu cho <code className="font-mono">{endpoint}</code>. Giao diện sẽ tự động hiển thị khi API sẵn sàng.
    </p>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('revenue');

  const revenueQuery = useQuery({ queryKey: ['reports', 'revenue'], queryFn: reportService.getRevenueReport, retry: false });
  const profitQuery = useQuery({ queryKey: ['reports', 'profit'], queryFn: reportService.getProfitReport, retry: false });
  const bestSellersQuery = useQuery({ queryKey: ['reports', 'best-sellers'], queryFn: reportService.getBestSellers, retry: false });
  const lowStockQuery = useQuery({ queryKey: ['reports', 'low-stock'], queryFn: reportService.getLowStock, retry: false });

  const bestSellerColumns: DataTableColumn<BestSeller>[] = [
    { key: 'productName', header: 'Tên sản phẩm' },
    { key: 'quantitySold', header: 'Số lượng đã bán', render: (r) => <span className="font-semibold text-slate-900">{r.quantitySold.toLocaleString()}</span> },
  ];

  const lowStockColumns: DataTableColumn<LowStockItem>[] = [
    { key: 'productName', header: 'Tên sản phẩm' },
    {
      key: 'quantity',
      header: 'Tồn hiện tại',
      render: (r) => <span className={`font-semibold ${r.quantity <= r.reorderLevel ? 'text-red-600' : 'text-slate-900'}`}>{r.quantity}</span>,
    },
    { key: 'reorderLevel', header: 'Mức đặt lại' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <span className={`ui-badge ${r.quantity <= r.reorderLevel ? 'ui-badge-red' : 'ui-badge-green'}`}>
          {r.quantity <= r.reorderLevel ? 'Cần nhập' : 'Ổn định'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Báo cáo" description="Doanh thu, lợi nhuận, sản phẩm bán chạy và tồn kho thấp." />

      <div className="flex w-fit gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'revenue' && (
        <div className="ui-card space-y-4">
          <h3 className="text-lg font-semibold">Tổng quan doanh thu</h3>
          {revenueQuery.isLoading ? (
            <p className="text-sm text-slate-500">Đang tải...</p>
          ) : revenueQuery.isError ? (
            <ApiUnavailable endpoint="GET /api/reports/revenue" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tổng doanh thu</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(revenueQuery.data?.totalRevenue ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Số đơn hàng</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{revenueQuery.data?.totalOrders ?? 0}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tổng sản phẩm bán</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{revenueQuery.data?.totalItems ?? 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profit' && (
        <div className="ui-card space-y-4">
          <h3 className="text-lg font-semibold">Tổng quan lợi nhuận</h3>
          {profitQuery.isLoading ? (
            <p className="text-sm text-slate-500">Đang tải...</p>
          ) : profitQuery.isError ? (
            <ApiUnavailable endpoint="GET /api/reports/profit" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Tổng doanh thu</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(profitQuery.data?.totalRevenue ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-slate-500">Lợi nhuận</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">{formatCurrency(profitQuery.data?.totalProfit ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-xs text-slate-500">Chi phí</p>
                <p className="mt-1 text-xl font-bold text-red-600">{formatCurrency(profitQuery.data?.totalCost ?? 0)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'best-sellers' && (
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Sản phẩm bán chạy</h3>
          <DataTable
            columns={bestSellerColumns}
            data={bestSellersQuery.data ?? []}
            rowKey={(r) => r.productName}
            isLoading={bestSellersQuery.isLoading}
            error={bestSellersQuery.isError ? 'API chưa sẵn sàng: GET /api/reports/best-sellers' : null}
            emptyTitle="Chưa có dữ liệu"
            emptyDescription="Chưa có hóa đơn nào được tạo."
          />
        </div>
      )}

      {activeTab === 'low-stock' && (
        <div className="ui-card">
          <h3 className="mb-4 text-lg font-semibold">Tồn kho thấp</h3>
          <DataTable
            columns={lowStockColumns}
            data={lowStockQuery.data ?? []}
            rowKey={(r) => r.productName}
            isLoading={lowStockQuery.isLoading}
            error={lowStockQuery.isError ? 'API chưa sẵn sàng: GET /api/reports/low-stock' : null}
            emptyTitle="Không có cảnh báo"
            emptyDescription="Tất cả sản phẩm đều trên mức đặt lại."
          />
        </div>
      )}
    </div>
  );
}
