import { Link } from 'react-router';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { logout } from '../services/userService';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const { user } = useContext(AuthContext) || {};
  const queryClient = useQueryClient();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      setIsDropdownOpen(false);
    } catch (err) {
      // Optionally handle error
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='bg-white shadow'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Left side - Logo and Navigation Links */}
          <div className='flex items-center space-x-8'>
            <Link to='/'>
              <h1 className='text-2xl font-bold text-blue-500'>Cook Book</h1>
            </Link>
            <div className='flex space-x-6'>
              <Link
                to='/recipes'
                className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
              >
                Recipes
              </Link>
              <Link
                to='/cookbooks'
                className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
              >
                Cookbooks
              </Link>
            </div>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className='flex items-center space-x-4'>
            <Link
              to='/recipes/create'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium'
            >
              Create Recipe
            </Link>

            {user ? (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1'
                >
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200'>
                    <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-100'>
                      <div className='font-medium'>{user.name}</div>
                      <div className='text-gray-500'>{user.email}</div>
                    </div>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex space-x-4'>
                <Link
                  to='/register'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
                >
                  Register
                </Link>
                <Link
                  to='/login'
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium'
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
