import { lazy, Suspense, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { PageHeader, SkeletonCard, SkeletonChart, StatCard } from '../components/ui';
import productService from '../services/productService';
import reportService from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import type { CategoryBreakdown } from '../types/report';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  PieChart,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const RevenueLineChart = lazy(() => import('../components/charts/RevenueLineChart'));
const ProfitLineChart = lazy(() => import('../components/charts/ProfitLineChart'));
const BestSellerBarChart = lazy(() => import('../components/charts/BestSellerBarChart'));
const CategoryPieChart = lazy(() => import('../components/charts/CategoryPieChart'));

function ChartFallback() {
  return <SkeletonChart />;
}

export default function DashboardPage() {
  const [
    revenueQuery,
    profitQuery,
    revenueTrendQuery,
    profitTrendQuery,
    bestSellersQuery,
    lowStockQuery,
    productsQuery,
  ] = useQueries({
    queries: [
      { queryKey: ['reports', 'revenue'], queryFn: reportService.getRevenueReport, retry: false },
      { queryKey: ['reports', 'profit'], queryFn: reportService.getProfitReport, retry: false },
      { queryKey: ['reports', 'revenue-trend'], queryFn: reportService.getRevenueTrend },
      { queryKey: ['reports', 'profit-trend'], queryFn: reportService.getProfitTrend },
      { queryKey: ['reports', 'best-sellers'], queryFn: reportService.getBestSellers, retry: false },
      { queryKey: ['reports', 'low-stock'], queryFn: reportService.getLowStock, retry: false },
      { queryKey: ['products'], queryFn: productService.getProducts },
    ],
  });

  const products = productsQuery.data ?? [];
  const bestSellers = bestSellersQuery.data ?? [];
  const lowStock = lowStockQuery.data ?? [];
  const revenueTrend = revenueTrendQuery.data ?? [];
  const profitTrend = profitTrendQuery.data ?? [];

  const reportsUnavailable = revenueQuery.isError && profitQuery.isError;

  const totalRevenue = revenueQuery.data?.totalRevenue ?? 0;
  const totalProfit = profitQuery.data?.totalProfit ?? 0;
  const activeProducts = products.filter((p) => p.isActive).length;

  const categoryData: CategoryBreakdown[] = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const name = p.category?.name ?? 'Chưa phân loại';
      map[name] = (map[name] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([categoryName, productCount]) => ({ categoryName, productCount }))
      .sort((a, b) => b.productCount - a.productCount);
  }, [products]);

  // Tính toán thay đổi phần trăm (mock)
  const revenueChange = 12.5;
  const profitChange = 8.3;
  const productChange = 3.2;

  return (
    <div className="space-y-6">
      {/* Page Header đơn giản hơn */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-indigo-100 text-sm mt-1">
              Tổng quan doanh thu, lợi nhuận và tồn kho
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
            <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {reportsUnavailable && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4" />
          <span>API báo cáo chưa sẵn sàng — biểu đồ đang dùng mock data.</span>
        </div>
      )}

      {/* Stats Grid - Giữ nguyên cấu trúc StatCard */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {revenueQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            label="Tổng doanh thu"
            value={reportsUnavailable ? '—' : formatCurrency(totalRevenue)}
            hint={reportsUnavailable ? 'Chờ API /reports' : 'Kỳ gần nhất'}
            trend="up"
            icon={
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +{revenueChange}%
                </span>
              </div>
            }
          />
        )}

        {profitQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            label="Lợi nhuận"
            value={reportsUnavailable ? '—' : formatCurrency(totalProfit)}
            hint={reportsUnavailable ? 'Chờ API /reports' : 'Kỳ gần nhất'}
            trend="up"
            icon={
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  +{profitChange}%
                </span>
              </div>
            }
          />
        )}

        {productsQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            label="Sản phẩm hoạt động"
            value={String(activeProducts)}
            hint={`Tổng ${products.length} sản phẩm`}
            trend="neutral"
            icon={
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                  +{productChange}%
                </span>
              </div>
            }
          />
        )}

        {lowStockQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <StatCard
            label="Tồn kho thấp"
            value={String(lowStock.length)}
            hint={lowStock.length > 0 ? 'Cần nhập thêm hàng' : 'Ổn định'}
            trend={lowStock.length > 0 ? 'down' : 'neutral'}
            icon={
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {lowStock.length > 0 && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    {lowStock.length} SP
                  </span>
                )}
              </div>
            }
          />
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Doanh thu 30 ngày</h3>
              <p className="text-xs text-slate-400 mt-0.5">Biểu đồ doanh thu theo ngày</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">Doanh thu</span>
            </div>
          </div>
          <Suspense fallback={<ChartFallback />}>
            <RevenueLineChart data={revenueTrend} isLoading={revenueTrendQuery.isLoading} />
          </Suspense>
        </div>

        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Lợi nhuận 30 ngày</h3>
              <p className="text-xs text-slate-400 mt-0.5">Biểu đồ lợi nhuận theo ngày</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-500">Lợi nhuận</span>
            </div>
          </div>
          <Suspense fallback={<ChartFallback />}>
            <ProfitLineChart data={profitTrend} isLoading={profitTrendQuery.isLoading} />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Top 5 sản phẩm bán chạy</h3>
              <p className="text-xs text-slate-400 mt-0.5">Sản phẩm có doanh số cao nhất</p>
            </div>
            <ShoppingBag className="w-5 h-5 text-slate-400" />
          </div>
          <Suspense fallback={<ChartFallback />}>
            <BestSellerBarChart data={bestSellers} isLoading={bestSellersQuery.isLoading} />
          </Suspense>
        </div>

        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Phân bố theo danh mục</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tỷ lệ sản phẩm theo danh mục</p>
            </div>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <Suspense fallback={<ChartFallback />}>
            <CategoryPieChart data={categoryData} isLoading={productsQuery.isLoading} />
          </Suspense>
        </div>
      </div>

      {/* Low Stock Table - Cải thiện giao diện bảng */}
      {lowStock.length > 0 && (
        <div className="ui-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Sản phẩm sắp hết hàng
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Cần nhập hàng bổ sung</p>
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              {lowStock.length} sản phẩm
            </span>
          </div>
          
          <div className="overflow-x-auto -mx-2">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-2">
                    Tên sản phẩm
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-2">
                    Tồn kho
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-2">
                    Mức đặt lại
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-2">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lowStock.map((item) => {
                  const quantity = Number(item.quantity ?? 0);
                  const isSoldOut = quantity <= 0;
                  const status = isSoldOut ? 'Hết hàng' : 'Sắp hết';
                  const statusClass = isSoldOut
                    ? 'text-white bg-red-600'
                    : 'text-red-600 bg-red-50';
                  const dotClass = isSoldOut
                    ? 'bg-white'
                    : 'bg-red-500';

                  return (
                    <tr key={`${item.productName}-${quantity}-${item.reorderLevel}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 text-sm font-medium text-slate-800">
                        {item.productName}
                      </td>
                      <td className="py-3 px-2 text-right text-sm">
                        <span className="font-semibold text-red-600">{quantity}</span>
                      </td>
                      <td className="py-3 px-2 text-right text-sm text-slate-500">
                        {item.reorderLevel}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}