import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string, 
    password: string, 
    fullName: string, 
    role?: string,
    stream?: string,
    degree?: string,
    college?: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('raghire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('raghire_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const me = await authApi.getMe();
          setUser(me);
          localStorage.setItem('raghire_user', JSON.stringify(me));
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data: AuthResponse = await authApi.login(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('raghire_token', data.access_token);
    localStorage.setItem('raghire_user', JSON.stringify(data.user));
  };

  const register = async (
    email: string, 
    password: string, 
    fullName: string, 
    role = 'student',
    stream?: string,
    degree?: string,
    college?: string
  ) => {
    const data: AuthResponse = await authApi.register(email, password, fullName, role, stream, degree, college);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('raghire_token', data.access_token);
    localStorage.setItem('raghire_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('raghire_token');
    localStorage.removeItem('raghire_user');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const me = await authApi.getMe();
        setUser(me);
        localStorage.setItem('raghire_user', JSON.stringify(me));
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
