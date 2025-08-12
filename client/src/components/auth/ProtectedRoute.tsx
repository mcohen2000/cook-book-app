import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size={24} />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
