import { Link } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { logout } from '../services/userService';
import { useQueryClient } from '@tanstack/react-query';

const Navbar = () => {
  const { user } = useContext(AuthContext) || {};
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <header className='bg-white shadow'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center flex-row'>
          <Link to='/'>
            <h1 className='text-2xl font-bold text-blue-500'>Cook Book</h1>
          </Link>
          <div className='flex gap-4'>
            <Link
              to='/recipes'
              className='text-gray-600 hover:text-gray-900 px-4 py-2'
            >
              Recipes
            </Link>
            <Link
              to='/cookbooks'
              className='text-gray-600 hover:text-gray-900 px-4 py-2'
            >
              Cookbooks
            </Link>
            <Link
              to='/recipes/create'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Create Recipe
            </Link>
          </div>
          <div className='flex gap-4'>
            {user ? (
              <button
                onClick={handleLogout}
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to='/register'
                  className='text-gray-600 hover:text-gray-900 px-4 py-2'
                >
                  Register
                </Link>
                <Link
                  to='/login'
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
