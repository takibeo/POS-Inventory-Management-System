import axiosInstance from '../api/axiosInstance';
import type { SaleInvoice } from '../types/sale';

const getSales = () => axiosInstance.get<SaleInvoice[]>('/sales').then(res => res.data);
const getSale = (id: string) => axiosInstance.get<SaleInvoice>(`/sales/${id}`).then(res => res.data);
const createSale = (sale: SaleInvoice) => axiosInstance.post<SaleInvoice>('/sales', sale).then(res => res.data);
const deleteSale = (id: string) => axiosInstance.delete(`/sales/${id}`);

export default { getSales, getSale, createSale, deleteSale };
