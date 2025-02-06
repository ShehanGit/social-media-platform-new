import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  UserCircleIcon, 
  HomeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchUsers } from '../../hooks/useSearchUsers';
import { User } from '../../types';

interface SearchResult {
  id: number;
  email: string;
  username: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  profilePictureUrl?: string;
}

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    results,
    isLoading: isSearching,
    updateSearch,
    clearCache
  } = useSearchUsers();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSearch(value);
    if (value.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    updateSearch('');
    setShowResults(false);
  };

  const handleUserSelect = (username: string | undefined) => {
    if (username) {
      navigate(`/profile/${username}`);
      clearSearch();
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-blue-600">
            SocialApp
          </Link>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    results.map((searchUser) => (
                      <div
                        key={searchUser.id}
                        onClick={() => handleUserSelect(searchUser.username)}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        {searchUser.profilePictureUrl ? (
                          <img
                            src={`http://localhost:8080${searchUser.profilePictureUrl}`}
                            alt={searchUser.username || 'User avatar'}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        )}
                        <div className="ml-3">
                          <p className="font-medium">
                            {searchUser.firstname} {searchUser.lastname}
                          </p>
                          {searchUser.username && (
                            <p className="text-sm text-gray-500">@{searchUser.username}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : searchTerm ? (
                    <div className="p-4 text-center text-gray-500">
                      No users found
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Home"
              >
                <HomeIcon className="h-6 w-6" />
              </Link>
              
              <Link
                to="/create-post"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Create Post"
              >
                <PlusIcon className="h-6 w-6" />
              </Link>

              {/* Profile Menu */}
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 hover:bg-gray-100 rounded-full">
                  {user?.profilePictureUrl ? (
                    <img
                      src={`http://localhost:8080${user.profilePictureUrl}`}
                      alt={user.username || ''}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                </Menu.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
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
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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