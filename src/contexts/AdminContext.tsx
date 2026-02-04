import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/services/api';

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and is valid
    const verifyAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const result = await authApi.verify();
          setIsAuthenticated(result.valid);
        } catch {
          localStorage.removeItem('admin_token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const result = await authApi.login(password);
      if (result.success && result.token) {
        localStorage.setItem('admin_token', result.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
