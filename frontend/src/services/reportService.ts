import axiosInstance from '../api/axiosInstance';
import type { RevenueReport, ProfitReport, BestSeller, LowStockItem } from '../types/report';

const getRevenueReport = () => axiosInstance.get<RevenueReport[]>('/reports/revenue').then(res => res.data);
const getProfitReport = () => axiosInstance.get<ProfitReport[]>('/reports/profit').then(res => res.data);
const getBestSellers = () => axiosInstance.get<BestSeller[]>('/reports/best-sellers').then(res => res.data);
const getLowStock = () => axiosInstance.get<LowStockItem[]>('/reports/low-stock').then(res => res.data);

export default { getRevenueReport, getProfitReport, getBestSellers, getLowStock };
