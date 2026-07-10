import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, DataTable, LoadingSpinner, type DataTableColumn, PageHeader } from '../components/ui';
import reportService from '../services/reportService';
import { formatCurrency } from '../utils/formatters';
import type { BestSeller, LowStockItem } from '../types/report';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingBag,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';

type ReportTab = 'revenue' | 'profit' | 'best-sellers' | 'low-stock';

const tabs: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
  { key: 'revenue', label: 'Doanh thu', icon: <DollarSign className="w-4 h-4" /> },
  { key: 'profit', label: 'Lợi nhuận', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'best-sellers', label: 'Bán chạy', icon: <ShoppingBag className="w-4 h-4" /> },
  { key: 'low-stock', label: 'Tồn kho thấp', icon: <AlertTriangle className="w-4 h-4" /> },
];

function ApiUnavailable({ endpoint }: { endpoint: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/80 backdrop-blur-sm px-4 py-3.5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-medium text-amber-800">
          Backend chưa trả dữ liệu
        </p>
        <p className="text-xs text-amber-700/80 mt-0.5">
          Giao diện sẽ tự động hiển thị khi
          <code className="mx-1 font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
            {endpoint}
          </code>
          sẵn sàng.
        </p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color = 'slate', icon, subtitle }: {
  label: string; 
  value: string; 
  color?: 'slate' | 'emerald' | 'red' | 'blue' | 'amber';
  icon?: React.ReactNode;
  subtitle?: string;
}) {
  const colorClasses = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  
  const textColor = {
    slate: 'text-slate-900',
    emerald: 'text-emerald-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
  };

  return (
    <div className={`rounded-xl border ${colorClasses[color]} p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${textColor[color]}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg bg-white/50 ${color === 'emerald' ? 'text-emerald-600' : color === 'red' ? 'text-red-600' : color === 'blue' ? 'text-blue-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-600'}`}>
            {icon}
          </div>
        )}
      </div>
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

  const bestSellerColumns: DataTableColumn<BestSeller>[] = useMemo(() => [
    { 
      key: 'productName', 
      header: 'Tên sản phẩm',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="font-medium">{r.productName}</span>
        </div>
      )
    },
    { 
      key: 'quantitySold', 
      header: 'Số lượng đã bán', 
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          {r.quantitySold.toLocaleString()}
        </span>
      )
    },
  ], []);

  const lowStockColumns: DataTableColumn<LowStockItem>[] = useMemo(() => [
    { 
      key: 'productName', 
      header: 'Tên sản phẩm',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <span className="font-medium">{r.productName}</span>
        </div>
      )
    },
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
    { 
      key: 'reorderLevel', 
      header: 'Mức đặt lại',
      render: (r) => (
        <span className="text-slate-500">{r.reorderLevel}</span>
      )
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          r.quantity <= r.reorderLevel 
            ? 'bg-red-100 text-red-700' 
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {r.quantity <= r.reorderLevel ? (
            <>
              <AlertTriangle className="w-3 h-3" />
              Cần nhập
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3" />
              Ổn định
            </>
          )}
        </span>
      ),
    },
  ], []);

  const activeTabLoading =
    (activeTab === 'revenue' && revenueQuery.isLoading) ||
    (activeTab === 'profit' && profitQuery.isLoading) ||
    (activeTab === 'best-sellers' && bestSellersQuery.isLoading) ||
    (activeTab === 'low-stock' && lowStockQuery.isLoading);

  const getTabIcon = (tab: ReportTab) => {
    const found = tabs.find(t => t.key === tab);
    return found?.icon;
  };

  return (
    <div className="space-y-6">
      {/* Page Header với gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Báo cáo
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Doanh thu, lợi nhuận, sản phẩm bán chạy và tồn kho thấp
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="secondary"
              className="bg-white/90 hover:bg-white text-indigo-700 hover:text-indigo-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium border border-white/20"
              onClick={() => {
                revenueQuery.refetch();
                profitQuery.refetch();
                bestSellersQuery.refetch();
                lowStockQuery.refetch();
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full flex-wrap gap-1.5 rounded-xl bg-slate-100/80 p-1.5 backdrop-blur-sm sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key 
                ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTabLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner label="Đang tải báo cáo..." />
        </div>
      )}

      {activeTab === 'revenue' && !revenueQuery.isLoading && (
        <div className="ui-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Tổng quan doanh thu</h3>
              <p className="text-xs text-slate-400 mt-0.5">Thống kê doanh thu tổng hợp</p>
            </div>
          </div>

          {revenueQuery.isError ? (
            <ApiUnavailable endpoint="GET /api/reports/revenue" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard 
                label="Tổng doanh thu" 
                value={formatCurrency(revenueQuery.data?.totalRevenue ?? 0)} 
                color="blue"
                icon={<DollarSign className="w-4 h-4" />}
                subtitle="Kỳ gần nhất"
              />
              <KpiCard 
                label="Số đơn hàng" 
                value={(revenueQuery.data?.totalOrders ?? 0).toLocaleString()} 
                color="slate"
                icon={<ShoppingBag className="w-4 h-4" />}
              />
              <KpiCard 
                label="Tổng sản phẩm bán" 
                value={(revenueQuery.data?.totalItems ?? 0).toLocaleString()} 
                color="slate"
                icon={<Package className="w-4 h-4" />}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'profit' && !profitQuery.isLoading && (
        <div className="ui-card space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Tổng quan lợi nhuận</h3>
              <p className="text-xs text-slate-400 mt-0.5">Phân tích lợi nhuận và chi phí</p>
            </div>
          </div>

          {profitQuery.isError ? (
            <ApiUnavailable endpoint="GET /api/reports/profit" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard 
                label="Tổng doanh thu" 
                value={formatCurrency(profitQuery.data?.totalRevenue ?? 0)} 
                color="slate"
                icon={<DollarSign className="w-4 h-4" />}
              />
              <KpiCard 
                label="Lợi nhuận" 
                value={formatCurrency(profitQuery.data?.totalProfit ?? 0)} 
                color="emerald"
                icon={<TrendingUp className="w-4 h-4" />}
                subtitle="Tỷ suất: 15.2%"
              />
              <KpiCard 
                label="Chi phí" 
                value={formatCurrency(profitQuery.data?.totalCost ?? 0)} 
                color="red"
                icon={<TrendingDown className="w-4 h-4" />}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'best-sellers' && !bestSellersQuery.isLoading && (
        <div className="ui-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sản phẩm bán chạy</h3>
              <p className="text-xs text-slate-400 mt-0.5">Top sản phẩm có doanh số cao nhất</p>
            </div>
          </div>

          <DataTable
            columns={bestSellerColumns}
            data={bestSellersQuery.data ?? []}
            rowKey={(r) => r.productName}
            isLoading={false}
            error={bestSellersQuery.isError ? 'API chưa sẵn sàng: GET /api/reports/best-sellers' : null}
            emptyTitle="Chưa có dữ liệu"
            emptyDescription="Chưa có hóa đơn nào được tạo."
            emptyAction={bestSellersQuery.isError ? (
              <Button type="button" variant="secondary" onClick={() => bestSellersQuery.refetch()}>
                Thử lại
              </Button>
            ) : undefined}
          />
        </div>
      )}

      {activeTab === 'low-stock' && !lowStockQuery.isLoading && (
        <div className="ui-card">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Tồn kho thấp</h3>
              <p className="text-xs text-slate-400 mt-0.5">Sản phẩm cần nhập hàng bổ sung</p>
            </div>
          </div>

          <DataTable
            columns={lowStockColumns}
            data={lowStockQuery.data ?? []}
            rowKey={(r) => r.productName}
            isLoading={false}
            error={lowStockQuery.isError ? 'API chưa sẵn sàng: GET /api/reports/low-stock' : null}
            emptyTitle="Không có cảnh báo"
            emptyDescription="🎉 Tất cả sản phẩm đều trên mức đặt lại."
          />
        </div>
      )}
    </div>
  );
}