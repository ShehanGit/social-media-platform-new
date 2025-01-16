import { useEffect, useState } from 'react';
import { postsAPI } from '../../api/post';
import { Post } from '../../types';
import PostCard from './PostCard';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import React from 'react';

interface PostListProps {
  userId?: number;
  sortBy?: 'createdAt' | 'likes';
}

const PostList = ({ userId, sortBy = 'createdAt' }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (userId) {
        response = await postsAPI.getUserPosts(page, 10);
        console.log('User posts response:', response); // Debug log
      } else if (sortBy === 'likes') {
        response = await postsAPI.getPostsByLikes(page, 10);
      } else {
        response = await postsAPI.getPosts(page, 10, sortBy);
      }

      // Safely handle the response
      if (response && typeof response === 'object') {
        const newPosts = response.content || [];
        if (page === 0) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        setHasMore(!response.last);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when userId or sortBy changes
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, [userId, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [page, userId, sortBy]);

  const handleDelete = async (postId: number) => {
    try {
      await postsAPI.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {posts?.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
        />
      ))}
      
      {hasMore && !loading && posts.length > 0 && (
        <div className="text-center py-4">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            isLoading={loading}
            variant="secondary"
          >
            Load More
          </Button>
        </div>
      )}

      {loading && posts.length > 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-4">
          No more posts to load
        </p>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No posts found
        </p>
      )}
    </div>
  );
};

export default PostList;