// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';
import React from 'react';

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  website?: string;
  phone?: string;
  location?: string;
}

interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Define and export the context
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this line

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      setIsLoading(false);
      // setIsAuthenticated(false); // Add this
      return;
    }

    try {
      const userData = await usersAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true); // Add this
    } catch (error) {
      localStorage.removeItem('token');
      // setIsAuthenticated(false); // Add this
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.token);
      // const userData = await usersAPI.getCurrentUser();
      // setUser(userData);
      setIsAuthenticated(true); // Add this
      
      navigate('/');
      toast.success('Welcome back!');
    } catch (error) {
      setIsAuthenticated(false); // Add this
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      await authAPI.register(registerData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false); // Add this
    navigate('/login');
    toast.success('Logged out successfully');
  };


  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await usersAPI.updateUser(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return function WrappedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    }, [isLoading, isAuthenticated, navigate]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
};