import { useQueries } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DataTable, type DataTableColumn, LoadingSpinner, PageHeader, StatCard } from '../components/ui';
import productService from '../services/productService';
import reportService from '../services/reportService';
import type { BestSeller, LowStockItem, ProfitReportResponse, RevenueReportResponse } from '../types/report';

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default function DashboardPage() {
  const [revenueQuery, profitQuery, bestSellersQuery, lowStockQuery, productsQuery] = useQueries({
    queries: [
      { queryKey: ['reports', 'revenue'], queryFn: reportService.getRevenueReport, retry: false },
      { queryKey: ['reports', 'profit'], queryFn: reportService.getProfitReport, retry: false },
      { queryKey: ['reports', 'best-sellers'], queryFn: reportService.getBestSellers, retry: false },
      { queryKey: ['reports', 'low-stock'], queryFn: reportService.getLowStock, retry: false },
      { queryKey: ['products'], queryFn: productService.getProducts },
    ],
  });

  const revenueData = revenueQuery.data as RevenueReportResponse | undefined;
  const profitData = profitQuery.data as ProfitReportResponse | undefined;
  const bestSellers = bestSellersQuery.data ?? [];
  const lowStock = lowStockQuery.data ?? [];
  const products = productsQuery.data ?? [];

  const totalRevenue = revenueData?.totalRevenue ?? 0;
  const totalProfit = profitData?.totalProfit ?? 0;
  const activeProducts = products.filter((p) => p.isActive).length;
  const reportsUnavailable =
    revenueQuery.isError && profitQuery.isError && bestSellersQuery.isError && lowStockQuery.isError;

  const chartData: { date: string; revenue?: number; profit?: number }[] = [];
  const chartLabel = 'revenue';

  const bestSellerColumns: DataTableColumn<BestSeller>[] = [
    { key: 'productName', header: 'Sản phẩm' },
    { key: 'quantitySold', header: 'Đã bán' },
  ];

  const lowStockColumns: DataTableColumn<LowStockItem>[] = [
    { key: 'productName', header: 'Sản phẩm' },
    { key: 'quantity', header: 'Tồn kho' },
    { key: 'reorderLevel', header: 'Mức đặt lại' },
  ];

  const isLoading = productsQuery.isLoading;
  const monitoredProducts = products.filter((p) => (p.reorderLevel ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Tổng quan doanh thu, lợi nhuận và tồn kho."
      />

      {reportsUnavailable && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          API báo cáo chưa sẵn sàng trên backend. Đang hiển thị số liệu từ danh sách sản phẩm.
        </p>
      )}

      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Doanh thu"
              value={reportsUnavailable ? '—' : formatCurrency(totalRevenue)}
              hint={reportsUnavailable ? 'Chờ API /reports' : 'Tổng kỳ gần nhất'}
            />
            <StatCard
              label="Lợi nhuận"
              value={reportsUnavailable ? '—' : formatCurrency(totalProfit)}
              hint={reportsUnavailable ? 'Chờ API /reports' : 'Tổng kỳ gần nhất'}
            />
            <StatCard
              label="Sản phẩm hoạt động"
              value={String(activeProducts)}
              hint={`Tổng ${products.length} sản phẩm`}
              trend="up"
            />
            <StatCard
              label="Cảnh báo tồn kho thấp"
              value={reportsUnavailable ? String(monitoredProducts) : String(lowStock.length)}
              hint={
                reportsUnavailable
                  ? 'Sản phẩm có mức đặt lại (chờ API /reports/low-stock)'
                  : lowStock.length > 0
                    ? 'Cần nhập thêm hàng'
                    : 'Ổn định'
              }
              trend={lowStock.length > 0 ? 'down' : 'neutral'}
            />
          </div>

          <div className="ui-card">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              {chartLabel === 'revenue' ? 'Doanh thu theo ngày' : 'Lợi nhuận theo ngày'}
            </h3>
            {chartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value)
                      }
                    />
                    <Bar
                      dataKey={chartLabel}
                      fill="#0f172a"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Chưa có dữ liệu biểu đồ.</p>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="ui-card">
              <h3 className="mb-4 text-lg font-semibold">Bán chạy</h3>
              <DataTable
                columns={bestSellerColumns}
                data={bestSellers}
                rowKey={(row) => row.productName}
                emptyTitle="Chưa có dữ liệu"
                emptyDescription="API best-sellers chưa trả về kết quả."
              />
            </div>
            <div className="ui-card">
              <h3 className="mb-4 text-lg font-semibold">Tồn kho thấp</h3>
              <DataTable
                columns={lowStockColumns}
                data={lowStock}
                rowKey={(row) => row.productName}
                emptyTitle="Không có cảnh báo"
                emptyDescription="Tất cả sản phẩm đều trên mức đặt lại."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
