// src/hooks/usePosts.ts
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { postsAPI } from '../api/post';
import { Post } from '../types';
import toast from 'react-hot-toast';

interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
}

interface UsePostsOptions {
  userId?: number;
  sortBy?: 'createdAt' | 'likes';
  pageSize?: number;
}

export interface PostCreateData {
  caption: string;
  media?: File;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isLoading: isCreating,
    error,
  } = useMutation<Post, Error, PostCreateData>(
    async (data: PostCreateData) => {
      const formData:any = new FormData();
      formData.append('caption', data.caption);
      if (data.media) {
        formData.append('media', data.media);
      }
      return postsAPI.createPost(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        toast.success('Post created successfully');
      },
      onError: () => {
        toast.error('Failed to create post');
      },
    }
  );

  return {
    createPost,
    isCreating,
    error,
  };
};

export const usePosts = ({ userId, sortBy = 'createdAt', pageSize = 10 }: UsePostsOptions = {}) => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery<PaginatedResponse<Post>, Error>(
    ['posts', userId, sortBy, page],
    () => userId
      ? postsAPI.getUserPosts(page, pageSize)
      : sortBy === 'likes'
      ? postsAPI.getPostsByLikes(page, pageSize)
      : postsAPI.getPosts(page, pageSize, sortBy),
    {
      keepPreviousData: true,
      onError: () => toast.error('Failed to load posts'),
    }
  );

  const hasNextPage = data ? !data.last : false;

  // Update post mutation
  const updatePost = useMutation<Post, Error, { postId: number; caption: string }>(
    ({ postId, caption }) => postsAPI.updatePost(postId, caption),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        toast.success('Post updated successfully');
      },
      onError: () => {
        toast.error('Failed to update post');
      },
    }
  );

  // Delete post mutation
  const deletePost = useMutation<void, Error, number>(
    (postId) => postsAPI.deletePost(postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        toast.success('Post deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete post');
      },
    }
  );

  // Load more posts
  const loadMore = useCallback(() => {
    if (!isFetching && hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasNextPage]);

  // Reset page
  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    posts: data?.content || [],
    isLoading,
    isFetching,
    error,
    hasNextPage,
    page,
    loadMore,
    resetPage,
    updatePost: updatePost.mutate,
    deletePost: deletePost.mutate,
    isUpdating: updatePost.isLoading,
    isDeleting: deletePost.isLoading,
  };
};

// Single post hook
export const usePost = (postId: number) => {
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery(['post', postId], () => postsAPI.getPost(postId), {
    onError: () => toast.error('Failed to load post'),
  });

  const updatePost = useMutation<Post, Error, string>(
    (caption) => postsAPI.updatePost(postId, caption),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', postId]);
        toast.success('Post updated successfully');
      },
      onError: () => {
        toast.error('Failed to update post');
      },
    }
  );

  const deletePost = useMutation<void, Error, void>(
    () => postsAPI.deletePost(postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        toast.success('Post deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete post');
      },
    }
  );

  return {
    post,
    isLoading,
    error,
    updatePost: updatePost.mutate,
    deletePost: deletePost.mutate,
    isUpdating: updatePost.isLoading,
    isDeleting: deletePost.isLoading,
  };
};

// Helper hook for post interactions
export const usePostInteractions = (postId: number) => {
  const queryClient = useQueryClient();

  // Optimistically update post likes
  const updatePostCache = (postId: number, updateFn: (post: Post) => Post) => {
    queryClient.setQueryData<Post>(
      ['post', postId],
      (oldPost) => {
        if (!oldPost) return null as unknown as Post;
        return updateFn(oldPost);
      }
    );
  };

  return {
    updatePostCache,
  };
};