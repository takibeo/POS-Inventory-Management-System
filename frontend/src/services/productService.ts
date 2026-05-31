import axiosInstance from '../api/axiosInstance';
import type { Product } from '../types/product';

const getProducts = () => axiosInstance.get<Product[]>('/products').then(res => res.data);
const getProduct = (id: string) => axiosInstance.get<Product>(`/products/${id}`).then(res => res.data);
const createProduct = (product: Product) => axiosInstance.post<Product>('/products', product).then(res => res.data);
const updateProduct = (id: string, product: Product) => axiosInstance.put<Product>(`/products/${id}`, product).then(res => res.data);
const deleteProduct = (id: string) => axiosInstance.delete(`/products/${id}`);

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
