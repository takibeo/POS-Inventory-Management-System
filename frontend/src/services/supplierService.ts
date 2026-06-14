import axiosInstance from '../api/axiosInstance';
import type { Supplier } from '../types/supplier';

type SupplierRequest = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;

const getSuppliers = () => axiosInstance.get<Supplier[]>('/suppliers').then((res) => res.data);
const createSupplier = (supplier: SupplierRequest) =>
  axiosInstance.post<Supplier>('/suppliers', supplier).then((res) => res.data);
const updateSupplier = (id: string, supplier: SupplierRequest) =>
  axiosInstance.put<Supplier>(`/suppliers/${id}`, supplier).then((res) => res.data);
const deleteSupplier = (id: string) => axiosInstance.delete(`/suppliers/${id}`);

export default { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
