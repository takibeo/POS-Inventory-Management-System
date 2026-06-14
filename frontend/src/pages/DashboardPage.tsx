import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
    DataTable, type DataTableColumn,
    LoadingSpinner, PageHeader, StatCard,
} from '../components/ui';
import productService from '../services/productService';
import reportService from '../services/reportService';
import type { BestSeller, LowStockItem } from '../types/report';

const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

type ChartTab = 'revenue' | 'profit';

export default function DashboardPage() {
    const [chartTab, setChartTab] = useState<ChartTab>('revenue');

    const [revenueQuery, profitQuery, bestSellersQuery, lowStockQuery, productsQuery] =
        useQueries({
            queries: [
                { queryKey: ['reports', 'revenue'], queryFn: reportService.getRevenueReport, retry: false },
                { queryKey: ['reports', 'profit'], queryFn: reportService.getProfitReport, retry: false },
                { queryKey: ['reports', 'best-sellers'], queryFn: reportService.getBestSellers, retry: false },
                { queryKey: ['reports', 'low-stock'], queryFn: reportService.getLowStock, retry: false },
                { queryKey: ['products'], queryFn: productService.getProducts },
            ],
        });

    const revenueData = revenueQuery.data ?? null;
    const profitData = profitQuery.data ?? null;
    const bestSellers = bestSellersQuery.data ?? [];
    const lowStock = lowStockQuery.data ?? [];
    const products = productsQuery.data ?? [];

    const reportsLoading = revenueQuery.isLoading || profitQuery.isLoading;
    const reportsUnavailable =
        revenueQuery.isError && profitQuery.isError &&
        bestSellersQuery.isError && lowStockQuery.isError;

    // Lấy từ object response, không reduce array
    const totalRevenue = revenueData?.totalRevenue ?? 0;
    const totalProfit = profitData?.totalProfit ?? 0;
    const activeProducts = products.filter((p) => p.isActive).length;
    const monitoredProducts = products.filter((p) => (p.reorderLevel ?? 0) > 0).length;

    const bestSellerColumns: DataTableColumn<BestSeller>[] = [
        { key: 'productName', header: 'Sản phẩm' },
        { key: 'quantitySold', header: 'Đã bán' },
    ];

    const lowStockColumns: DataTableColumn<LowStockItem>[] = [
        { key: 'productName', header: 'Sản phẩm' },
        { key: 'quantity', header: 'Tồn kho' },
        { key: 'reorderLevel', header: 'Mức đặt lại' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Tổng quan doanh thu, lợi nhuận và tồn kho."
            />

            {reportsUnavailable && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3
          text-sm text-amber-800">
                    API báo cáo chưa sẵn sàng trên backend. Đang hiển thị số liệu từ
                    danh sách sản phẩm.
                </p>
            )}

            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Doanh thu"
                    value={reportsUnavailable ? '—' : formatCurrency(totalRevenue)}
                    hint={reportsUnavailable ? 'Chờ API /reports' : 'Tổng kỳ gần nhất'}
                    trend="up"
                    isLoading={reportsLoading}
                    icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Lợi nhuận"
                    value={reportsUnavailable ? '—' : formatCurrency(totalProfit)}
                    hint={reportsUnavailable ? 'Chờ API /reports' : 'Tổng kỳ gần nhất'}
                    trend="up"
                    isLoading={reportsLoading}
                    icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Sản phẩm hoạt động"
                    value={String(activeProducts)}
                    hint={`Tổng ${products.length} sản phẩm`}
                    trend="neutral"
                    isLoading={productsQuery.isLoading}
                    icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                            />
                        </svg>
                    }
                />
                <StatCard
                    label="Cảnh báo tồn kho thấp"
                    value={reportsUnavailable
                        ? String(monitoredProducts)
                        : String(lowStock.length)}
                    hint={lowStock.length > 0 ? 'Cần nhập thêm hàng' : 'Ổn định'}
                    trend={lowStock.length > 0 ? 'down' : 'neutral'}
                    isLoading={reportsLoading}
                    icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Tổng quan tài chính – thay biểu đồ vì API trả object không phải array */}
            <div className="ui-card">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Tổng quan tài chính
                    </h3>
                    <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                        {(['revenue', 'profit'] as ChartTab[]).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setChartTab(tab)}
                                className={`rounded-md px-3 py-1 text-xs font-medium transition
                  ${chartTab === tab
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab === 'revenue' ? 'Doanh thu' : 'Lợi nhuận'}
                            </button>
                        ))}
                    </div>
                </div>

                {reportsLoading ? (
                    <LoadingSpinner />
                ) : reportsUnavailable ? (
                    <p className="py-4 text-center text-sm text-slate-500">
                        Chưa có dữ liệu — API báo cáo chưa sẵn sàng.
                    </p>
                ) : chartTab === 'revenue' ? (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">Tổng doanh thu</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">
                                {formatCurrency(revenueData?.totalRevenue ?? 0)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">Số đơn hàng</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">
                                {revenueData?.totalOrders ?? 0}
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">Tổng sản phẩm bán</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">
                                {revenueData?.totalItems ?? 0}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">Tổng doanh thu</p>
                            <p className="mt-1 text-xl font-bold text-slate-900">
                                {formatCurrency(profitData?.totalRevenue ?? 0)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-xs text-slate-500">Lợi nhuận</p>
                            <p className="mt-1 text-xl font-bold text-emerald-700">
                                {formatCurrency(profitData?.totalProfit ?? 0)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-red-50 p-4">
                            <p className="text-xs text-slate-500">Chi phí</p>
                            <p className="mt-1 text-xl font-bold text-red-600">
                                {formatCurrency(profitData?.totalCost ?? 0)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Best sellers + Low stock */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="ui-card">
                    <h3 className="mb-4 text-lg font-semibold">Bán chạy</h3>
                    <DataTable
                        columns={bestSellerColumns}
                        data={bestSellers}
                        rowKey={(r) => r.productName}
                        isLoading={bestSellersQuery.isLoading}
                        error={bestSellersQuery.isError ? 'Chưa có API best-sellers' : null}
                        emptyTitle="Chưa có dữ liệu"
                        emptyDescription="API best-sellers chưa trả về kết quả."
                    />
                </div>
                <div className="ui-card">
                    <h3 className="mb-4 text-lg font-semibold">Tồn kho thấp</h3>
                    <DataTable
                        columns={lowStockColumns}
                        data={lowStock}
                        rowKey={(r) => r.productName}
                        isLoading={lowStockQuery.isLoading}
                        error={lowStockQuery.isError ? 'Chưa có API low-stock' : null}
                        emptyTitle="Không có cảnh báo"
                        emptyDescription="Tất cả sản phẩm đều trên mức đặt lại."
                    />
                </div>
            </div>
        </div>
    );
}