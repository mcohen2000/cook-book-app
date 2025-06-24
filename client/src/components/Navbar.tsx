import { Link } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { logout } from '../services/userService';
import { useQueryClient } from '@tanstack/react-query';
import DropdownMenu from './DropdownMenu';
import UserAvatarIcon from './UserAvatarIcon';
import PlusIcon from './PlusIcon';
import DownwardArrowIcon from './DownwardArrowIcon';

const Navbar = () => {
  const { user } = useContext(AuthContext) || {};
  const queryClient = useQueryClient();

  // Handler for logout that closes the dropdown and updates UI
  const handleLogoutWithClose =
    (setOpen: (open: boolean) => void) => async () => {
      try {
        await logout();
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        setOpen(false);
      } catch (err) {
        // Optionally handle error
      }
    };

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
            {/* Create Dropdown */}
            {user ? (
              <>
                <DropdownMenu
                  align='right'
                  trigger={
                    <span
                      className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                      aria-label='Create'
                    >
                      <PlusIcon />
                    </span>
                  }
                  links={[
                    { url: '/recipes/create', text: 'Create Recipe' },
                    { url: '/cookbooks/create', text: 'Create Cookbook' },
                  ]}
                />

                <DropdownMenu
                  align='right'
                  trigger={
                    <span className='flex items-center'>
                      <span
                        className='flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                        aria-label='User menu'
                      >
                        <UserAvatarIcon name={user.name} />
                      </span>
                      <DownwardArrowIcon className='ml-2 w-4 h-4 text-gray-700' />
                    </span>
                  }
                  links={({ setOpen }) => [
                    { text: user.name, onClick: undefined },
                    { text: user.email, onClick: undefined },
                    { text: 'Profile', url: '/profile' },
                    { text: 'Logout', onClick: handleLogoutWithClose(setOpen) },
                  ]}
                />
              </>
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
