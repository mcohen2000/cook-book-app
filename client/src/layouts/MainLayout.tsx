import { Outlet, Link } from 'react-router';

const MainLayout = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center flex-row'>
            <h1 className='text-2xl font-bold text-blue-500'>Cook Book</h1>
            <div className='flex gap-4'>
              <Link to='/recipes' className='text-gray-600 hover:text-gray-900'>
                Browse Recipes
              </Link>
              <Link
                to='/recipes/create'
                className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              >
                Create Recipe
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
