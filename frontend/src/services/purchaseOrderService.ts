import axiosInstance from '../api/axiosInstance';
import type { PurchaseOrder } from '../types/purchaseOrder';

const getPurchaseOrders = () => axiosInstance.get<PurchaseOrder[]>('/purchase-orders').then(res => res.data);
const getPurchaseOrder = (id: string) => axiosInstance.get<PurchaseOrder>(`/purchase-orders/${id}`).then(res => res.data);
const createPurchaseOrder = (order: PurchaseOrder) => axiosInstance.post<PurchaseOrder>('/purchase-orders', order).then(res => res.data);
const updatePurchaseOrder = (id: string, order: PurchaseOrder) => axiosInstance.put<PurchaseOrder>(`/purchase-orders/${id}`, order).then(res => res.data);
const receivePurchaseOrder = (id: string) => axiosInstance.post<PurchaseOrder>(`/purchase-orders/${id}/receive`).then(res => res.data);

export default { getPurchaseOrders, getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder, receivePurchaseOrder };
