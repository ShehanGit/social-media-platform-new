// src/api/comments.ts
import api from '../utils/axios';
import { Comment, PaginatedResponse } from '../types';

export const commentsAPI = {
  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, {
      content
    });
    return response.data;
  },

  getComments: async (
    postId: number, 
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, {
      params: { page, size }
    });
    return response.data;
  },

  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    const response = await api.put<Comment>(`/posts/comments/${commentId}`, {
      content
    });
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/posts/comments/${commentId}`);
  },

  getCommentCount: async (postId: number): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>(`/posts/${postId}/comments/count`);
    return response.data;
  }
};