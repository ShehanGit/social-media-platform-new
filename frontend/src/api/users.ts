import api from '../utils/axios';
import { User, RelationshipStats, PaginatedResponse, UserUpdateData } from '../types';

interface UserSummary {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isFollowing: boolean;
  profilePictureUrl?: string;
}

export const usersAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  getRelationshipStats: async (userId: number): Promise<RelationshipStats> => {
    const response = await api.get<RelationshipStats>(`/users/${userId}/relationships`);
    return response.data;
  },

  updateUser: async (updateData: UserUpdateData): Promise<User> => {
    const response = await api.put<User>('/users/me', updateData);
    return response.data;
  },

  searchUsers: async (
    query: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  getFollowers: async (
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<UserSummary>> => {
    const response = await api.get<PaginatedResponse<UserSummary>>(`/users/${userId}/followers`, {
      params: { page, size }
    });
    return response.data;
  },

  getFollowing: async (
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<UserSummary>> => {
    const response = await api.get<PaginatedResponse<UserSummary>>(`/users/${userId}/following`, {
      params: { page, size }
    });
    return response.data;
  },

  toggleFollow: async (userId: number): Promise<RelationshipStats> => {
    const response = await api.post<RelationshipStats>(`/users/${userId}/follow`);
    return response.data;
  },

  updateProfilePicture: async (file: File): Promise<{ pictureUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ pictureUrl: string }>('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getUserStats: async (userId: number): Promise<{ followersCount: number; followingCount: number }> => {
    const response = await api.get<{ followersCount: number; followingCount: number }>(`/users/${userId}/stats`);
    return response.data;
  }
};