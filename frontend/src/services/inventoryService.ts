import axiosInstance from '../api/axiosInstance';
import type { Inventory } from '../types/inventory';

const getInventories = () => axiosInstance.get<Inventory[]>('/inventories').then(res => res.data);
const getInventory = (id: string) => axiosInstance.get<Inventory>(`/inventories/${id}`).then(res => res.data);
const adjustInventory = (inventoryId: string, quantity: number, remark?: string) =>
  axiosInstance.post<unknown>(`/inventories/adjust?inventoryId=${inventoryId}&quantity=${quantity}${remark ? `&remark=${encodeURIComponent(remark)}` : ''}`);
const getTransactionsByBranch = (branchId: string) =>
  axiosInstance.get(`/inventories/${branchId}/transactions`).then(res => res.data);

export default { getInventories, getInventory, adjustInventory, getTransactionsByBranch };
