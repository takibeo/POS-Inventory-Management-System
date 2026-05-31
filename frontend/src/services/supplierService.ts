import axiosInstance from '../api/axiosInstance';
import type { Supplier } from '../types/supplier';

const getSuppliers = () => axiosInstance.get<Supplier[]>('/suppliers').then(res => res.data);
const createSupplier = (supplier: Supplier) => axiosInstance.post<Supplier>('/suppliers', supplier).then(res => res.data);
const updateSupplier = (id: string, supplier: Supplier) => axiosInstance.put<Supplier>(`/suppliers/${id}`, supplier).then(res => res.data);
const deleteSupplier = (id: string) => axiosInstance.delete(`/suppliers/${id}`);

export default { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
