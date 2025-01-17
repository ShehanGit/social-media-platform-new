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

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [commentCount, setCommentCount] = useState<number>(post.commentsCount || 0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentsAPI.createComment(post.id, newComment.trim());
      setComments(prev => [response, ...prev]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleViewComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        const response = await commentsAPI.getComments(post.id, 0);
        setComments(response.content);
        setCommentCount(response.totalElements);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 mb-4">
      {/* Post Image */}
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
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center space-x-2">
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
      <div className="px-4 py-1 flex items-center space-x-4 text-sm">
        <span>{likesCount} likes</span>
        <span>{commentCount} comments</span>
      </div>

      {/* Username and Content */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-center flex-grow">
            {`${post.user.firstname} ${post.user.lastname}`}
          </h3>
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
        <div className="px-4 py-3 border-t border-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="text-sm mb-2">
              <span className="font-medium mr-2">
                {comment.userName.includes('@') 
                  ? comment.userName.split('@')[0] 
                  : comment.userName}
              </span>
              {comment.content}
            </div>
          ))}

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