import axiosInstance from '../api/axiosInstance';
import type { Category } from '../types/category';

const getCategories = () => axiosInstance.get<Category[]>('/categories').then(res => res.data);
const createCategory = (category: Category) => axiosInstance.post<Category>('/categories', category).then(res => res.data);
const updateCategory = (id: string, category: Category) => axiosInstance.put<Category>(`/categories/${id}`, category).then(res => res.data);
const deleteCategory = (id: string) => axiosInstance.delete(`/categories/${id}`);

export default { getCategories, createCategory, updateCategory, deleteCategory };
