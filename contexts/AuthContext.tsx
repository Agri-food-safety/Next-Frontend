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
  updateProfile: (profileData: Partial<User>) => Promise<void>; // Add update function type
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

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      // Filter out non-updatable fields like phone, role, userId etc.
      const updatableData = {
        fullName: profileData.fullName,
        city: profileData.city,
        state: profileData.state,
        gpsLat: profileData.gpsLat,
        gpsLng: profileData.gpsLng,
      };
      // Ensure API call returns the updated profile data structure
      const response = await authAPI.updateProfile(updatableData); 
      // Assuming response structure matches ProfileResponse after update
      const updatedUser = response.data as User; 
      setUser(updatedUser); // Update user state with fresh data from API
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error; // Re-throw to be handled by the component
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
        updateProfile, // Provide the update function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
