import React, { useState } from 'react';
import PostList from '../components/post/PostList';
import PostCreate from '../components/post/PostCreate';
import { withAuth } from '../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'likes'>('createdAt');
  const [key, setKey] = useState(0);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = () => {
    setKey(prev => prev + 1);
    setShowCreatePost(false); // Close the create post form after successful creation
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'likes')}
            className="border rounded-md px-3 py-2"
          >
            <option value="createdAt">Most Recent</option>
            <option value="likes">Most Popular</option>
          </select>
          <Button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Post</span>
          </Button>
        </div>
      </div>

      {/* Modal Overlay */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Create Post</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <PostCreate onPostCreated={handlePostCreated} />
            </div>
          </div>
        </div>
      )}

      <PostList key={key} sortBy={sortBy} />
    </div>
  );
};

export default withAuth(Home);