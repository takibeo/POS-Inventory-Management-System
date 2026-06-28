import axiosInstance from '../api/axiosInstance';
import type {
  RevenueReportResponse,
  ProfitReportResponse,
  BestSeller,
  LowStockItem,
  RevenueTrend,
  ProfitTrend,
} from '../types/report';

const getRevenueReport = () =>
    axiosInstance.get<RevenueReportResponse>('/reports/revenue')
        .then(res => res.data);

const getProfitReport = () =>
    axiosInstance.get<ProfitReportResponse>('/reports/profit')
        .then(res => res.data);

const getBestSellers = () =>
    axiosInstance.get<BestSeller[]>('/reports/best-sellers')
        .then(res => res.data);

const getLowStock = () =>
    axiosInstance.get<LowStockItem[]>('/reports/low-stock')
        .then(res => res.data);


// Thử gọi API, nếu backend chưa có thì dùng mock 30 ngày
const getRevenueTrend = async (): Promise<RevenueTrend[]> => {
  try {
    const res = await axiosInstance.get<RevenueTrend[]>(
        '/reports/revenue-trend?days=30'
    );
    return res.data;
  } catch {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return {
        date: d.toISOString().slice(0, 10),
        revenue: Math.floor(Math.random() * 50_000_000) + 10_000_000,
      };
    });
  }
};

const getProfitTrend = async (): Promise<ProfitTrend[]> => {
  try {
    const res = await axiosInstance.get<ProfitTrend[]>(
        '/reports/profit-trend?days=30'
    );
    return res.data;
  } catch {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return {
        date: d.toISOString().slice(0, 10),
        profit: Math.floor(Math.random() * 20_000_000) + 5_000_000,
      };
    });
  }
};

export default {
  getRevenueReport,
  getProfitReport,
  getBestSellers,
  getLowStock,
  getRevenueTrend,
  getProfitTrend,
};
