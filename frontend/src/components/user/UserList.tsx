import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../api/users';
import Button from '../common/Button';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import React from 'react';

interface UserListProps {
  userId: number;
  type: 'followers' | 'following';
}

const UserList = ({ userId, type }: UserListProps) => {
  const [users, setUsers] = useState<Array<{
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    profilePictureUrl?: string;
    isFollowing: boolean;
  }>>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [userId, type, page]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response:any = type === 'followers'
        ? await usersAPI.getFollowers(userId, page)
        : await usersAPI.getFollowing(userId, page);

      if (page === 0) {
        setUsers(response.content);
      } else {
        setUsers(prev => [...prev, ...response.content]);
      }
      setHasMore(!response.last);
    } catch (error) {
      toast.error(`Failed to load ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId: number) => {
    try {
      await usersAPI.toggleFollow(targetUserId);
      setUsers(users.map(user => {
        if (user.id === targetUserId) {
          return { ...user, isFollowing: !user.isFollowing };
        }
        return user;
      }));
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className="space-y-4">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <Link
            to={`/profile/${user.username}`}
            className="flex items-center space-x-3"
          >
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <h3 className="font-medium">{user.username}</h3>
              <p className="text-sm text-gray-500">
                {user.firstname} {user.lastname}
              </p>
            </div>
          </Link>

          <Button
            onClick={() => handleFollowToggle(user.id)}
            variant={user.isFollowing ? 'outline' : 'primary'}
            size="sm"
          >
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
      ))}

      {hasMore && (
        <div className="text-center py-4">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            isLoading={isLoading}
            variant="secondary"
          >
            Load More
          </Button>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <p className="text-center text-gray-500 py-4">
          No more {type} to load
        </p>
      )}

      {!isLoading && users.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No {type} found
        </p>
      )}
    </div>
  );
};

export default UserList;