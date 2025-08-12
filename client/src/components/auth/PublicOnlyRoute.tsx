import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

const PublicOnlyRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size={24} />
      </div>
    );
  }

  return user ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicOnlyRoute;
