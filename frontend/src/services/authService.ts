import axiosInstance from '../api/axiosInstance';
import type { LoginPayload, TokenResponse, User } from '../types/auth';

const login = async (payload: LoginPayload): Promise<TokenResponse> => {
  const response = await axiosInstance.post('/auth/login', payload);
  return response.data;
};

const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await axiosInstance.post('/auth/refresh', { refreshToken });
  return response.data;
};

const logout = async (refreshToken: string): Promise<void> => {
  await axiosInstance.post('/auth/logout', { refreshToken });
};

const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

const authService = {
  login,
  refreshToken,
  logout,
  getCurrentUser,
};

export default authService;
