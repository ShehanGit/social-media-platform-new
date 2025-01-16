import api from '../utils/axios';
import { AuthResponse, LoginCredentials, RegisterData } from '../types';

export const authAPI = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/user_register', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/authenticate', credentials);
    return response.data;
  }
};