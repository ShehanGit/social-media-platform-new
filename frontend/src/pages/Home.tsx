import React, { useState } from 'react';
import PostList from '../components/post/PostList';
import PostCreate from '../components/post/PostCreate';
import { withAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'likes'>('createdAt');
  const [key, setKey] = useState(0); // Used to force PostList re-render

  const handlePostCreated = () => {
    // Force PostList to refresh by updating its key
    setKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <PostCreate onPostCreated={handlePostCreated} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'likes')}
          className="border rounded-md px-3 py-2"
        >
          <option value="createdAt">Most Recent</option>
          <option value="likes">Most Popular</option>
        </select>
      </div>

      <PostList key={key} sortBy={sortBy} />
    </div>
  );
};

export default withAuth(Home);