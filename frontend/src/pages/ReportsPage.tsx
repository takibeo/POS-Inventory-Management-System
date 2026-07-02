import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, type DataTableColumn, PageHeader } from '../components/ui';
import reportService from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import type { BestSeller, LowStockItem } from '../types/report';

type ReportTab = 'revenue' | 'profit' | 'best-sellers' | 'low-stock';

const tabs: { key: ReportTab; label: string }[] = [
  { key: 'revenue', label: 'Doanh thu' },
  { key: 'profit', label: 'Lợi nhuận' },
  { key: 'best-sellers', label: 'Bán chạy' },
  { key: 'low-stock', label: 'Tồn kho thấp' },
];

function ApiUnavailable({ endpoint }: { endpoint: string }) {
  return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-200
      bg-amber-50 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
             fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-amber-800">
            Backend chưa trả dữ liệu
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Giao diện sẽ tự động hiển thị khi
            <code className="mx-1 font-mono">{endpoint}</code>
            sẵn sàng.
          </p>
        </div>
      </div>
  );
}

function KpiCard({ label, value, color = 'slate' }: {
  label: string; value: string; color?: 'slate' | 'emerald' | 'red';
}) {
  const bg = color === 'emerald' ? 'bg-emerald-50' :
      color === 'red' ? 'bg-red-50' : 'bg-slate-50';
  const text = color === 'emerald' ? 'text-emerald-700' :
      color === 'red' ? 'text-red-600' : 'text-slate-900';
  return (
      <div className={`rounded-xl ${bg} p-4`}>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`mt-1 text-xl font-bold ${text}`}>{value}</p>
      </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('revenue');

  const revenueQuery = useQuery({
    queryKey: ['reports', 'revenue'],
    queryFn: reportService.getRevenueReport,
    retry: false,
  });
  const profitQuery = useQuery({
    queryKey: ['reports', 'profit'],
    queryFn: reportService.getProfitReport,
    retry: false,
  });
  const bestSellersQuery = useQuery({
    queryKey: ['reports', 'best-sellers'],
    queryFn: reportService.getBestSellers,
    retry: false,
  });
  const lowStockQuery = useQuery({
    queryKey: ['reports', 'low-stock'],
    queryFn: reportService.getLowStock,
    retry: false,
  });

  const bestSellerColumns: DataTableColumn<BestSeller>[] = [
    { key: 'productName', header: 'Tên sản phẩm' },
    {
      key: 'quantitySold',
      header: 'Số lượng đã bán',
      render: (r) => (
          <span className="font-semibold text-slate-900">
          {r.quantitySold.toLocaleString()}
        </span>
      ),
    },
  ];

  const lowStockColumns: DataTableColumn<LowStockItem>[] = [
    { key: 'productName', header: 'Tên sản phẩm' },
    {
      key: 'quantity',
      header: 'Tồn hiện tại',
      render: (r) => (
          <span className={`font-semibold ${
              r.quantity <= r.reorderLevel ? 'text-red-600' : 'text-slate-900'
          }`}>
          {r.quantity}
        </span>
      ),
    },
    { key: 'reorderLevel', header: 'Mức đặt lại' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => (
          <span className={`ui-badge ${
              r.quantity <= r.reorderLevel ? 'ui-badge-red' : 'ui-badge-green'
          }`}>
          {r.quantity <= r.reorderLevel ? 'Cần nhập' : 'Ổn định'}
        </span>
      ),
    },
  ];

  return (
      <div className="space-y-6">
        <PageHeader
            title="Báo cáo"
            description="Doanh thu, lợi nhuận, sản phẩm bán chạy và tồn kho thấp."
        />

        {/* Tab bar */}
        <div className="flex w-fit gap-1 rounded-xl border border-slate-200
        bg-slate-50 p-1">
          {tabs.map((tab) => (
              <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition
              ${activeTab === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab.label}
              </button>
          ))}
        </div>

        {/* Revenue tab */}
        {activeTab === 'revenue' && (
            <div className="ui-card space-y-4">
              <h3 className="text-lg font-semibold">Tổng quan doanh thu</h3>
              {revenueQuery.isLoading ? (
                  <p className="text-sm text-slate-500">Đang tải...</p>
              ) : revenueQuery.isError ? (
                  <ApiUnavailable endpoint="GET /api/reports/revenue" />
              ) : (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <KpiCard
                        label="Tổng doanh thu"
                        value={formatCurrency(revenueQuery.data?.totalRevenue ?? 0)}
                    />
                    <KpiCard
                        label="Số đơn hàng"
                        value={String(revenueQuery.data?.totalOrders ?? 0)}
                    />
                    <KpiCard
                        label="Tổng sản phẩm bán"
                        value={String(revenueQuery.data?.totalItems ?? 0)}
                    />
                  </div>
              )}
            </div>
        )}

        {/* Profit tab */}
        {activeTab === 'profit' && (
            <div className="ui-card space-y-4">
              <h3 className="text-lg font-semibold">Tổng quan lợi nhuận</h3>
              {profitQuery.isLoading ? (
                  <p className="text-sm text-slate-500">Đang tải...</p>
              ) : profitQuery.isError ? (
                  <ApiUnavailable endpoint="GET /api/reports/profit" />
              ) : (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <KpiCard
                        label="Tổng doanh thu"
                        value={formatCurrency(profitQuery.data?.totalRevenue ?? 0)}
                    />
                    <KpiCard
                        label="Lợi nhuận"
                        value={formatCurrency(profitQuery.data?.totalProfit ?? 0)}
                        color="emerald"
                    />
                    <KpiCard
                        label="Chi phí"
                        value={formatCurrency(profitQuery.data?.totalCost ?? 0)}
                        color="red"
                    />
                  </div>
              )}
            </div>
        )}

        {/* Best sellers tab */}
        {activeTab === 'best-sellers' && (
            <div className="ui-card">
              <h3 className="mb-4 text-lg font-semibold">Sản phẩm bán chạy</h3>
              <DataTable
                  columns={bestSellerColumns}
                  data={bestSellersQuery.data ?? []}
                  rowKey={(r) => r.productName}
                  isLoading={bestSellersQuery.isLoading}
                  error={bestSellersQuery.isError
                      ? 'API chưa sẵn sàng: GET /api/reports/best-sellers'
                      : null}
                  emptyTitle="Chưa có dữ liệu bán hàng"
                  emptyDescription="Tạo hóa đơn bán hàng trong trang POS để dữ liệu xuất hiện ở đây."
              />
            </div>
        )}

        {/* Low stock tab */}
        {activeTab === 'low-stock' && (
            <div className="ui-card">
              <h3 className="mb-4 text-lg font-semibold">Tồn kho thấp</h3>
              <DataTable
                  columns={lowStockColumns}
                  data={lowStockQuery.data ?? []}
                  rowKey={(r) => r.productName}
                  isLoading={lowStockQuery.isLoading}
                  error={lowStockQuery.isError
                      ? 'API chưa sẵn sàng: GET /api/reports/low-stock'
                      : null}
                  emptyTitle="Không có cảnh báo tồn kho"
                  emptyDescription="Tất cả sản phẩm đều có tồn kho trên mức đặt lại. Kiểm tra lại trong trang Tồn kho."
              />
            </div>
        )}
      </div>
  );
}