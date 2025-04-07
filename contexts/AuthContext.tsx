"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  phone: string;
  fullName: string;
  role: string;
  city?: string;
  state?: string;
  gpsLat?: number;
  gpsLng?: number;
  createdAt?: string;
  lastActive?: string;
}

interface LoginResponse {
  success: boolean;
  data: User;
  token: string;
}

interface ProfileResponse {
  success: boolean;
  data: User;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = (await authAPI.getProfile()).data as ProfileResponse;
          if (response.success) {
            setUser(response.data);
          }
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const { data } = await authAPI.login({ phone, password });
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.data);
        router.push('/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
