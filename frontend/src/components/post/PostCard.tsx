import { useState } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types';
import { likesAPI } from '../../api/likes';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import React from 'react';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(post.likesCount > 0);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getMediaUrl = (path: string | null) => {
    if (!path) return '/default-avatar.png';
    // Ensure the path starts with /media if it doesn't already
    const cleanPath = path.startsWith('/media') ? path : `/media${path}`;
    return `http://localhost:8080${cleanPath}`;
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (onDelete) {
          await onDelete(post.id);
          toast.success('Post deleted successfully');
        }
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  // Format the caption by removing quotes if they exist
  const formattedCaption = post.caption.replace(/^"|"$/g, '');

  if (!post.user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500">Post data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden my-4">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={getMediaUrl(post.user.profilePictureUrl)}
            alt={post.user.username || 'User'}
            className="h-10 w-10 rounded-full object-cover bg-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
          <div>
            <p className="font-semibold">{post.user.username}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        {currentUser?.id === post.user.id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Post Media */}
      {post.mediaUrl && !imageError && (
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          {post.mediaType === 'IMAGE' ? (
            <img
              src={getMediaUrl(post.mediaUrl)}
              alt="Post content"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : post.mediaType === 'VIDEO' ? (
            <video
              src={getMediaUrl(post.mediaUrl)}
              controls
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : null}
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
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span>{post.commentsCount || 0}</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-gray-800">{formattedCaption}</p>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4">
          <div className="border-t pt-4">
            <p className="text-gray-500 text-sm">
              {post.commentsCount === 0 
                ? 'No comments yet' 
                : `${post.commentsCount} comment${post.commentsCount === 1 ? '' : 's'}`
              }
            </p>
            {/* Comments would be rendered here when implemented */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;