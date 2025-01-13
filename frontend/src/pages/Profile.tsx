import React from 'react';
import Profile from '../components/user/Profile';
import { withAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <Profile />
    </div>
  );
};

export default withAuth(ProfilePage);