// src/components/common/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, HomeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import React from 'react';

const Navbar = () => {
  const { user, logout } = useAuth() as any;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-blue-600">
            SocialApp
          </Link>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
                <HomeIcon className="h-6 w-6" />
              </Link>
              <Link to="/create-post" className="p-2 hover:bg-gray-100 rounded-full">
                <PlusIcon className="h-6 w-6" />
              </Link>
              
              {/* Profile Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                  {user.profilePictureUrl ? (
                    <img
                      src={"http://localhost:8080" + user.profilePictureUrl}
                      alt={user.username}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;