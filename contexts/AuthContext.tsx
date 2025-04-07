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

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
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
        console.log("Token", token)
        if (token) {  
          const { data } = await authAPI.getProfile();
          console.log("data", data)
          setUser(data.data);
        }
      } catch (error) {
        console.log(error)
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const { success, data } = await authAPI.login({ phone, password });
      console.log('Login successful:', data);
      if (success) {
        localStorage.setItem('authToken', data.access_token);
        setUser(data);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const { data } = await authAPI.updateProfile(profileData);
      setUser(data.data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
