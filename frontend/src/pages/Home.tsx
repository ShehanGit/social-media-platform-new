// src/pages/Home.tsx
import { useState } from 'react';
import PostList from '../components/post/PostList';
import PostCreate from '../components/post/PostCard';
import { withAuth } from '../contexts/AuthContext';
import React from 'react';

const Home = () => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'likes'>('createdAt');

  return (
    <div className="space-y-6">
      {/* <PostCreate post={undefined} /> */}
      
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

      <PostList sortBy={sortBy} />
    </div>
  );
};

export default withAuth(Home);