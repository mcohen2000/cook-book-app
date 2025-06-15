import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Cook Book</h1>
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
