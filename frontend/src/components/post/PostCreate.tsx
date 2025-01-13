// src/components/post/PostCreate.tsx
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCreatePost } from '../../hooks/usePosts';
import toast from 'react-hot-toast';
import React from 'react';

interface PostCreateForm {
  caption: string;
  media?: FileList;
}

const PostCreate = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PostCreateForm>();
  const { createPost, isCreating } = useCreatePost();

  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      handlePreview(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: PostCreateForm) => {
    try {
      await createPost({
        caption: data.caption,
        media: data.media?.[0]
      });
      reset();
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Caption Input */}
        <div>
          <textarea
            {...register('caption', {
              required: 'Caption is required',
              maxLength: {
                value: 2000,
                message: 'Caption must be less than 2000 characters'
              }
            })}
            placeholder="What's on your mind?"
            className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.caption ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
          />
          {errors.caption && (
            <p className="mt-1 text-sm text-red-500">
              {errors.caption.message}
            </p>
          )}
        </div>

        {/* Media Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            {...register('media')}
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
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
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="media-upload"
              className="flex flex-col items-center justify-center cursor-pointer py-6"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium
            ${isCreating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Post...
            </div>
          ) : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostCreate;