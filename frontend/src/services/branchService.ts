import axiosInstance from '../api/axiosInstance';
import type { Branch } from '../types/branch';

type BranchRequest = Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>;

const getBranches = () => axiosInstance.get<Branch[]>('/branches').then((res) => res.data);
const createBranch = (branch: BranchRequest) =>
  axiosInstance.post<Branch>('/branches', branch).then((res) => res.data);
const updateBranch = (id: string, branch: BranchRequest) =>
  axiosInstance.put<Branch>(`/branches/${id}`, branch).then((res) => res.data);
const deleteBranch = (id: string) => axiosInstance.delete(`/branches/${id}`);

export default { getBranches, createBranch, updateBranch, deleteBranch };
