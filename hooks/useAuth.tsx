import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import type { User, Role } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await mockApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, pass: string) => {
    try {
      const loggedInUser = await mockApi.login(email, pass);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const newUser = await mockApi.signup(name, email, phone, pass);
      setUser(newUser);
      toast.success(`Welcome, ${newUser.name}! Your account has been created.`);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Signup failed';
       toast.error(errorMessage);
       throw error;
    }
  }

  const logout = async () => {
    await mockApi.logout();
    setUser(null);
    toast.success('You have been logged out.');
  };

  const value = { user, loading, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
