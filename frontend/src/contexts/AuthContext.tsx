import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginPayload, TokenResponse, User } from '../types/auth';
import authService from '../services/authService';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../api/axiosInstance';

function parseTokenRoles(token: string | null): string[] {
  if (!token) return [];

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = decodeURIComponent(
      atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    const payload = JSON.parse(payloadJson);
    if (!Array.isArray(payload.roles)) {
      return [];
    }
    return payload.roles.map((role: string) => role.replace(/^ROLE_/, ''));
  } catch {
    return [];
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(accessToken));
  const [roles, setRoles] = useState<string[]>(parseTokenRoles(accessToken));
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const token = await authService.refreshToken(refreshToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
        setAccessToken(token.accessToken);
        setRoles(parseTokenRoles(token.accessToken));
        setIsAuthenticated(true);
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAccessToken(null);
        setIsAuthenticated(false);
        setRoles([]);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    const token = await authService.login(payload);
    localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
    setAccessToken(token.accessToken);
    setRoles(parseTokenRoles(token.accessToken));
    setIsAuthenticated(true);
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
    return token;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // ignore logout failure and clear client state anyway
      }
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken(null);
    setIsAuthenticated(false);
    setRoles([]);
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ accessToken, isAuthenticated, roles, loading, login, logout, hasRole }),
    [accessToken, isAuthenticated, loading, roles]
  );

  function hasRole(role: string) {
    return roles.includes(role) || roles.includes(`ROLE_${role}`);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
