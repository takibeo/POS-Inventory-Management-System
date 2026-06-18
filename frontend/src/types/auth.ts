export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  status: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  roles: string[];
  loading: boolean;
  login: (payload: LoginPayload) => Promise<TokenResponse>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}
