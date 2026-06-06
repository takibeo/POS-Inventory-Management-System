import axiosInstance from '../api/axiosInstance';
import type { Product, ProductFormValues } from '../types/product';

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

type ProductApiPayload = Omit<ProductFormValues, 'categoryId' | 'supplierId'> & {
  id?: string;
  category?: { id: string };
  supplier?: { id: string };
};

function toApiPayload(values: ProductFormValues, id?: string): ProductApiPayload {
  const { categoryId, supplierId, ...rest } = values;
  return {
    ...(id ? { id } : {}),
    ...rest,
    ...(categoryId ? { category: { id: categoryId } } : {}),
    ...(supplierId ? { supplier: { id: supplierId } } : {}),
  };
}

const getProducts = () => axiosInstance.get<PageResponse<Product>>('/products').then((res) => res.data.content);
const getProduct = (id: string) => axiosInstance.get<Product>(`/products/${id}`).then((res) => res.data);
const createProduct = (values: ProductFormValues) => {
  const payload = toApiPayload(values, crypto.randomUUID());
  return axiosInstance.post<Product>('/products', payload).then((res) => res.data);
};
const updateProduct = (id: string, values: ProductFormValues) =>
  axiosInstance.put<Product>(`/products/${id}`, toApiPayload(values, id)).then((res) => res.data);
const deleteProduct = (id: string) => axiosInstance.delete(`/products/${id}`);

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
