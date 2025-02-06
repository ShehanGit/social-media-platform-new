import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { postsAPI } from '../../api/post';
import toast from 'react-hot-toast';
import Button from '../common/Button';

interface PostCreateProps {
  onPostCreated?: () => void;
  onClose?: () => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated, onClose }) => {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setMedia(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMedia(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setCaption('');
    clearMedia();
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!caption.trim() && !media) {
      toast.error('Please add a caption or image');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('caption', caption);
      if (media) {
        formData.append('media', media);
      }

      await postsAPI.createPost(formData);
      
      toast.success('Post created successfully');
      resetForm();
      
      if (onPostCreated) {
        onPostCreated();
      }

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      // Handle moderation errors and other errors
      if (error.response?.data?.message) {
        toast.error(`Failed to create post: ${error.response.data.message}`);
      } else {
        toast.error('Failed to create post. Please try again.');
      }
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Caption Input */}
      <div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* Media Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          onChange={handleMediaChange}
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          id="media-upload"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-96 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="media-upload"
            className="flex flex-col items-center justify-center cursor-pointer py-6 hover:bg-gray-50 transition-colors"
          >
            <PhotoIcon className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Click to upload a photo
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG up to 5MB
            </p>
          </label>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || (!caption.trim() && !media)}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostCreate;