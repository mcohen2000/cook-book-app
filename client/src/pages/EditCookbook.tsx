import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCookbook, useUpdateCookbook } from '../queries/useBooks';
import { useAuth } from '../hooks/useAuth';
import { isAuthor as checkIsAuthor } from '../utils/isAuthor';
import CookbookForm from '../components/CookbookForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditCookbook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cookbook, isLoading, error } = useCookbook(id!);
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [initialData, setInitialData] = useState({
    title: '',
    description: '',
  });
  const updateCookbook = useUpdateCookbook();

  // Check if user is the author
  const authorId =
    typeof cookbook?.author === 'string'
      ? cookbook.author
      : cookbook?.author?._id;
  const isAuthor = checkIsAuthor(currentUser?.id || '', authorId || '');

  // Update initial data when cookbook data loads
  useEffect(() => {
    if (cookbook) {
      setInitialData({
        title: cookbook.title,
        description: cookbook.description || '',
      });
    }
  }, [cookbook]);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className='flex flex-col justify-center items-center text-center py-8'>
        <LoadingSpinner size={24} />
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    );
  }

  // Show error if not found or not authorized
  if (error || !cookbook) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-500'>
          {error instanceof Error ? error.message : 'Cookbook not found'}
        </p>
      </div>
    );
  }

  // Redirect if not author
  if (!isAuthor) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-500'>
          You are not authorized to edit this cookbook.
        </p>
      </div>
    );
  }

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    await updateCookbook.mutateAsync({
      id: cookbook._id,
      ...data,
    });
    navigate(`/cookbooks/${cookbook._id}`);
  };

  return (
    <CookbookForm
      onSubmit={handleSubmit}
      title='Edit Cookbook'
      subtitle='Update your cookbook details'
      backTo={`/cookbooks/${cookbook._id}`}
      backText='Back to Cookbook'
      initialData={initialData}
      submitText='Save Changes'
      isSubmitting={updateCookbook.isPending}
    />
  );
}
