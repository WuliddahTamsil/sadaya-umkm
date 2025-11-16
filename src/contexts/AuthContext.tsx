import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../config/api';

export type UserRole = 'user' | 'umkm' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isOnboarded: boolean;
  isVerified: boolean;
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
  address?: string;
  description?: string;
  storeName?: string;
}

interface RegisterData {
  name?: string;
  businessName?: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  description?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(api.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Login gagal';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || 'Login gagal';
        } catch (e) {
          // Jika response bukan JSON
          errorMessage = `Login gagal: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        isOnboarded: data.user.isOnboarded || false,
        isVerified: data.user.isVerified || false,
        status: data.user.status,
        phone: data.user.phone,
        address: data.user.address,
        description: data.user.description,
        storeName: data.user.storeName,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const isProduction = import.meta.env.PROD;
        const errorMsg = isProduction 
          ? 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.'
          : 'Tidak dapat terhubung ke server. Pastikan backend server sudah berjalan (jalankan: npm run dev:all)';
        throw new Error(errorMsg);
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(api.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Registrasi gagal';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || 'Registrasi gagal';
        } catch (e) {
          // Jika response bukan JSON
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setUser({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        isOnboarded: result.user.isOnboarded || false,
        isVerified: result.user.isVerified || false,
        status: result.user.status,
        phone: result.user.phone,
        address: result.user.address,
        description: result.user.description,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        const isProduction = import.meta.env.PROD;
        const errorMsg = isProduction 
          ? 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.'
          : 'Tidak dapat terhubung ke server. Pastikan backend server sudah berjalan (jalankan: npm run dev:all)';
        throw new Error(errorMsg);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const completeOnboarding = async () => {
    if (user) {
      // Update isOnboarded di state
      setUser({ ...user, isOnboarded: true });
      
      // Update juga di backend (optional, karena sudah diupdate saat upload)
      try {
        const response = await fetch(api.users.getById(user.id));
        if (response.ok) {
          const result = await response.json();
          const updatedUser = result.data;
          setUser({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isOnboarded: updatedUser.isOnboarded || true,
            isVerified: updatedUser.isVerified || false,
            status: updatedUser.status,
            phone: updatedUser.phone,
            address: updatedUser.address,
            description: updatedUser.description,
          });
        }
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    if (!user) return;

    try {
      const response = await fetch(api.users.getById(user.id));
      
      if (!response.ok) {
        console.error('Failed to refresh user data');
        return;
      }

      const result = await response.json();
      const updatedUser = result.data;
      
      setUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isOnboarded: updatedUser.isOnboarded || false,
        isVerified: updatedUser.isVerified || false,
        status: updatedUser.status,
        phone: updatedUser.phone,
        address: updatedUser.address,
        description: updatedUser.description,
      });
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Auto-refresh user data when component mounts (if user is logged in)
  useEffect(() => {
    if (!user || user.role === 'admin') return;

    // Refresh user data on mount
    const refresh = async () => {
      try {
        const response = await fetch(api.users.getById(user.id));
        if (!response.ok) return;
        const result = await response.json();
        const updatedUser = result.data;
        setUser({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isOnboarded: updatedUser.isOnboarded || false,
          isVerified: updatedUser.isVerified || false,
          status: updatedUser.status,
          phone: updatedUser.phone,
          address: updatedUser.address,
          description: updatedUser.description,
        });
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };
    
    refresh();
    
    // Refresh every 30 seconds to check for status updates
    const interval = setInterval(() => {
      refresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user?.id]); // Only run when user ID changes

  return (
    <AuthContext.Provider value={{ user, login, register, logout, completeOnboarding, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
