import { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { Post, Comment } from '../../types';
import { commentsAPI } from '../../api/comments';
import { likesAPI } from '../../api/likes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import React from 'react';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
}

interface CommentState {
  content: Comment[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  console.log('PostCard rendering with post:', post);

  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [commentState, setCommentState] = useState<CommentState>({
    content: [],
    page: 0,
    hasMore: true,
    isLoading: false
  });
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await likesAPI.getLikeStatus(post.id);
        setIsLiked(response.liked);
        setLikesCount(response.likeCount);
      } catch (error) {
        console.error('Failed to get like status:', error);
      }
    };
    checkLikeStatus();
  }, [post.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await commentsAPI.getCommentCount(post.id);
      setCommentCount(response.count);
    } catch (error) {
      console.error('Failed to get comment count:', error);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [post.id]);

  const loadComments = async () => {
    try {
      setCommentState(prev => ({ ...prev, isLoading: true }));
      const response = await commentsAPI.getComments(post.id, commentState.page);
      setCommentState(prev => ({
        content: prev.page === 0 ? response.content : [...prev.content, ...response.content],
        page: prev.page,
        hasMore: !response.last,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load comments:', error);
      setCommentState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleShowComments = () => {
    if (!showComments) {
      setShowComments(true);
      loadComments();
    } else {
      setShowComments(false);
    }
  };

  const handleLoadMoreComments = () => {
    setCommentState(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentsAPI.createComment(post.id, newComment);
      setCommentState(prev => ({
        ...prev,
        content: [response, ...prev.content]
      }));
      setNewComment('');
      await fetchCommentCount();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentsAPI.deleteComment(commentId);
      setCommentState(prev => ({
        ...prev,
        content: prev.content.filter(comment => comment.id !== commentId)
      }));
      await fetchCommentCount();
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async () => {
    try {
      const response = await likesAPI.toggleLike(post.id);
      setIsLiked(response.liked);
      setLikesCount(response.likeCount);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const getMediaUrl = (path: string | null): string => {
    if (!path) return '/default-avatar.png';
    const cleanPath = path.startsWith('/media') ? path : `/media${path}`;
    return `http://localhost:8080${cleanPath}`;
  };

  // Early return if post or user data is missing
  if (!post || !post.user) {
    console.error('Missing post or user data:', post);
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={getMediaUrl(post.user.profilePictureUrl)}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover bg-gray-200"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
          <div>
            <p className="font-semibold text-gray-900">
              {post.user.firstname} {post.user.lastname}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        {currentUser?.id === post.user.id && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Post Media */}
      {post.mediaUrl && !imageError && (
        <div className="relative w-full bg-gray-100" style={{ paddingBottom: '100%' }}>
          <img
            src={getMediaUrl(post.mediaUrl)}
            alt="Post content"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
            <span>{likesCount}</span>
          </button>
          <button
            onClick={handleShowComments}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span>{commentCount}</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-gray-800 whitespace-pre-wrap">{post.caption}</p>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-4">
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                disabled={!newComment.trim()}
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>

            <div className="space-y-3">
              {commentState.content.map((comment) => (
                <div key={comment.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{comment.userName}</p>
                    <p className="text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {comment.isAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {commentState.hasMore && (
              <button
                onClick={handleLoadMoreComments}
                className="w-full text-blue-500 hover:text-blue-600 text-sm font-medium py-2"
                disabled={commentState.isLoading}
              >
                {commentState.isLoading ? 'Loading...' : 'Load more comments'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;