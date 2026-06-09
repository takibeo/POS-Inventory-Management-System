import axiosInstance from '../api/axiosInstance';
import type {
  RevenueReportResponse,
  ProfitReportResponse,
  BestSeller,
  LowStockItem,
} from '../types/report';

const getRevenueReport = () => axiosInstance.get<RevenueReportResponse>('/reports/revenue').then(res => res.data);
const getProfitReport = () => axiosInstance.get<ProfitReportResponse>('/reports/profit').then(res => res.data);
const getBestSellers = () => axiosInstance.get<BestSeller[]>('/reports/best-sellers').then(res => res.data);
const getLowStock = () => axiosInstance.get<LowStockItem[]>('/reports/low-stock').then(res => res.data);

export default { getRevenueReport, getProfitReport, getBestSellers, getLowStock };
