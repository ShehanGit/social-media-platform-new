// src/api/likes.ts
import api from '../utils/axios';

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export const likesAPI = {
  toggleLike: async (postId: number): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/posts/${postId}/like`);
    return response.data;
  },

  getLikeStatus: async (postId: number): Promise<LikeResponse> => {
    const response = await api.get<LikeResponse>(`/posts/${postId}/like/status`);
    return response.data;
  },

  getLikeCount: async (postId: number): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>(`/posts/${postId}/likes/count`);
    return response.data;
  }
};