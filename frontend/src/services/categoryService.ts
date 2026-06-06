import axiosInstance from '../api/axiosInstance';
import type { Category } from '../types/category';

type CategoryRequest = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

const getCategories = () => axiosInstance.get<PageResponse<Category>>('/categories').then(res => res.data.content);
const createCategory = (category: CategoryRequest) => axiosInstance.post<Category>('/categories', category).then(res => res.data);
const updateCategory = (id: string, category: CategoryRequest) => axiosInstance.put<Category>(`/categories/${id}`, category).then(res => res.data);
const deleteCategory = (id: string) => axiosInstance.delete(`/categories/${id}`);

export default { getCategories, createCategory, updateCategory, deleteCategory };
