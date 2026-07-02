import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
    PageHeader,
    SkeletonCard,
    StatCard,
} from '../components/ui';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import ProfitLineChart from '../components/charts/ProfitLineChart';
import BestSellerBarChart from '../components/charts/BestSellerBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import productService from '../services/productService';
import reportService from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import type { CategoryBreakdown } from '../types/report';

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
    const isRefetching =
        revenueQuery.isRefetching || profitQuery.isRefetching ||
        revenueTrendQuery.isRefetching || profitTrendQuery.isRefetching;

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

    const handleRefetch = () => {
        revenueQuery.refetch();
        profitQuery.refetch();
        revenueTrendQuery.refetch();
        profitTrendQuery.refetch();
        bestSellersQuery.refetch();
        lowStockQuery.refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <PageHeader
                    title="Dashboard"
                    description="Tổng quan doanh thu, lợi nhuận và tồn kho."
                />
                <button
                    type="button"
                    onClick={handleRefetch}
                    disabled={isRefetching}
                    className="flex items-center gap-2 rounded-xl border border-slate-300
            bg-white px-3 py-2 text-sm font-medium text-slate-700
            transition hover:bg-slate-50 disabled:opacity-50 mt-1"
                >
                    <svg
                        className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isRefetching ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            {reportsUnavailable && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200
          bg-amber-50 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-amber-800">
                            API báo cáo chưa sẵn sàng
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            Biểu đồ đang dùng mock data. Backend cần triển khai
                            <code className="mx-1 font-mono">/api/reports/*</code>
                            để hiển thị dữ liệu thực.
                        </p>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {revenueQuery.isLoading ? <SkeletonCard /> : (
                    <StatCard
                        label="Tổng doanh thu"
                        value={reportsUnavailable ? '—' : formatCurrency(totalRevenue)}
                        hint={reportsUnavailable ? 'Chờ API /reports' : 'Kỳ gần nhất'}
                        trend="up"
                        icon={
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                )}

                {profitQuery.isLoading ? <SkeletonCard /> : (
                    <StatCard
                        label="Lợi nhuận"
                        value={reportsUnavailable ? '—' : formatCurrency(totalProfit)}
                        hint={reportsUnavailable ? 'Chờ API /reports' : 'Kỳ gần nhất'}
                        trend="up"
                        icon={
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                )}

                {productsQuery.isLoading ? <SkeletonCard /> : (
                    <StatCard
                        label="Sản phẩm hoạt động"
                        value={String(activeProducts)}
                        hint={`Tổng ${products.length} sản phẩm`}
                        trend="neutral"
                        icon={
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                        }
                    />
                )}

                {lowStockQuery.isLoading ? <SkeletonCard /> : (
                    <StatCard
                        label="Tồn kho thấp"
                        value={String(lowStock.length)}
                        hint={lowStock.length > 0 ? 'Cần nhập thêm hàng' : 'Ổn định'}
                        trend={lowStock.length > 0 ? 'down' : 'neutral'}
                        icon={
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                    />
                )}
            </div>

            {/* Charts hàng 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="ui-card">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Doanh thu 30 ngày
                    </h3>
                    <RevenueLineChart
                        data={revenueTrend}
                        isLoading={revenueTrendQuery.isLoading}
                    />
                </div>
                <div className="ui-card">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Lợi nhuận 30 ngày
                    </h3>
                    <ProfitLineChart
                        data={profitTrend}
                        isLoading={profitTrendQuery.isLoading}
                    />
                </div>
            </div>

            {/* Charts hàng 2 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="ui-card">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Top 5 sản phẩm bán chạy
                    </h3>
                    <BestSellerBarChart
                        data={bestSellers}
                        isLoading={bestSellersQuery.isLoading}
                    />
                </div>
                <div className="ui-card">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Phân bố theo danh mục
                    </h3>
                    <CategoryPieChart
                        data={categoryData}
                        isLoading={productsQuery.isLoading}
                    />
                </div>
            </div>

            {/* Sản phẩm sắp hết hàng */}
            {lowStock.length > 0 && (
                <div className="ui-card">
                    <h3 className="mb-4 text-base font-semibold text-slate-900">
                        Sản phẩm sắp hết hàng
                    </h3>
                    <div className="divide-y divide-slate-100">
                        {lowStock.map((item) => (
                            <div key={item.productName}
                                 className="flex items-center justify-between py-2.5">
                                <span className="text-sm text-slate-800">{item.productName}</span>
                                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500">
                    Tồn: <strong className="text-red-600">{item.quantity}</strong>
                  </span>
                                    <span className="text-slate-400">
                    Mức đặt lại: {item.reorderLevel}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}