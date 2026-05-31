import axiosInstance from '../api/axiosInstance';
import type { LoginPayload, TokenResponse } from '../types/auth';

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

const authService = {
  login,
  refreshToken,
  logout,
};

export default authService;
