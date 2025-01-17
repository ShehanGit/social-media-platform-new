import React, { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { Post, Comment } from '../../types';
import { commentsAPI } from '../../api/comments';
import { likesAPI } from '../../api/likes';
import toast from 'react-hot-toast';

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
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [commentState, setCommentState] = useState<CommentState>({
    content: [],
    page: 0,
    hasMore: true,
    isLoading: false
  });
  const [commentCount, setCommentCount] = useState<number>(post.commentsCount || 0);
  const [imageError, setImageError] = useState<boolean>(false);

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

  const handleLike = async () => {
    try {
      const response = await likesAPI.toggleLike(post.id);
      setIsLiked(response.liked);
      setLikesCount(response.likeCount);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const loadComments = async () => {
    try {
      setCommentState(prev => ({ ...prev, isLoading: true }));
      const response = await commentsAPI.getComments(post.id, commentState.page);
      
      setCommentState(prev => ({
        content: commentState.page === 0 ? response.content : [...prev.content, ...response.content],
        page: prev.page + 1,
        hasMore: !response.last,
        isLoading: false
      }));
      setCommentCount(response.totalElements);
    } catch (error) {
      console.error('Failed to load comments:', error);
      setCommentState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleViewComments = () => {
    setShowComments(!showComments);
    if (!showComments && commentState.content.length === 0) {
      loadComments();
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentsAPI.createComment(post.id, newComment.trim());
      setCommentState(prev => ({
        ...prev,
        content: [response, ...prev.content]
      }));
      setNewComment('');
      setCommentCount(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
      {/* Image */}
      {post.mediaUrl && !imageError && (
        <div className="relative aspect-square">
          <img
            src={`http://localhost:8080${post.mediaUrl}`}
            alt="Post content"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2">
        <div className="flex space-x-4">
          <button onClick={handleLike} className="focus:outline-none">
            {isLiked ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
          <button onClick={handleViewComments} className="focus:outline-none">
            <ChatBubbleLeftIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Likes and Comments Count */}
      <div className="px-4 py-1 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <span>{likesCount} likes</span>
            <span>{commentCount} comments</span>
          </div>
        </div>
      </div>

      {/* Username and Caption */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm flex-grow text-center font-medium">
            {`${post.user.firstname} ${post.user.lastname}`}
          </span>
          <span className="text-sm text-gray-500">
            {format(new Date(post.createdAt), 'MMM d')}
          </span>
        </div>
        {post.caption && (
          <p className="text-sm mt-1">
            {post.caption}
          </p>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-2 border-t">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {commentState.content.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-medium mr-2">
                  {comment.userName.includes('@') 
                    ? comment.userName.split('@')[0] 
                    : comment.userName}
                </span>
                {comment.content}
              </div>
            ))}
            {commentState.hasMore && (
              <button
                onClick={loadComments}
                className="text-gray-500 text-sm w-full text-center py-2"
                disabled={commentState.isLoading}
              >
                {commentState.isLoading ? 'Loading...' : 'View more comments'}
              </button>
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="mt-3 flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-sm border-none focus:ring-0 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`ml-2 text-blue-500 font-semibold text-sm ${
                !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;