import { Link, useLocation, useParams } from 'react-router';
import { useCookbook } from '../queries/useBooks';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/book';
import { useAuth } from '../hooks/useAuth';
import { useLikeCookbook, useUnlikeCookbook } from '../queries/useUsers';
import HeartIcon from '../components/icons/HeartIcon';
import { useDeleteCookbook } from '../queries/useBooks';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import TrashIcon from '../components/icons/TrashIcon';
import EditIcon from '../components/icons/EditIcon';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { useModal } from '../context/ModalContext';

const CookbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: cookbook,
    isLoading: cookbookLoading,
    error: cookbookError,
  } = useCookbook(id!);
  const { user: currentUser } = useAuth();
  const likeCookbook = useLikeCookbook();
  const unlikeCookbook = useUnlikeCookbook();
  const deleteCookbook = useDeleteCookbook();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  if (cookbookLoading) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading cookbook...</p>
        </div>
      </div>
    );
  }

  if (cookbookError || !cookbook) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <p className='text-red-500'>
            {cookbookError
              ? (cookbookError as Error).message
              : 'Cookbook not found'}
          </p>
        </div>
      </div>
    );
  }

  // At this point, cookbook is guaranteed to be defined
  const isLiked = currentUser?.likedCookbooks?.includes(cookbook._id);
  const isAuthor =
    currentUser &&
    (cookbook.author === currentUser.id ||
      (typeof cookbook.author === 'object' &&
        cookbook.author._id === currentUser.id));

  const handleToggleLike = () => {
    if (!currentUser) return;
    if (isLiked) {
      unlikeCookbook.mutate(cookbook._id);
    } else {
      likeCookbook.mutate(cookbook._id);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCookbook.mutateAsync(cookbook._id);
      closeModal();
      navigate('/cookbooks');
    } catch (err) {
      // Optionally show error
      console.error('Failed to delete cookbook:', err);
    }
  };

  const handleOpenDeleteModal = () => {
    openModal(
      <ConfirmDeleteModal
        itemType='cookbook'
        itemName={cookbook.title}
        onConfirm={handleDelete}
        loading={deleteCookbook.isPending}
      />
    );
  };

  const location = useLocation();
  const backTo = location.state?.backTo || {
    to: '/cookbooks',
    text: 'Back to Cookbooks',
  };

  const returnTo: { to: string; text: string } = {
    to: `/cookbooks/${id}`,
    text: 'Back to Cookbook',
  };

  // Get author name (could be string or User object)
  const authorName =
    typeof cookbook.author === 'string'
      ? cookbook.author
      : cookbook.author.name;

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <BackButton to={backTo.to} text={backTo.text} />
        <div className='space-x-4'>
          {isAuthor && (
            <>
              <Link
                to={`/cookbooks/${id}/edit`}
                className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors'
              >
                <EditIcon className='w-5 h-5 mr-2' />
                Edit Cookbook
              </Link>
              <button
                onClick={handleOpenDeleteModal}
                className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white transition-colors cursor-pointer'
              >
                <TrashIcon className='mr-2' />
                Delete Cookbook
              </button>
            </>
          )}
        </div>
      </div>
      <div className='space-y-6'>
        {/* Cookbook Header */}
        <div className='bg-white shadow rounded-lg p-6'>
          <div className='flex flex-row justify-between items-stretch'>
            <div className='flex-1'>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {cookbook.title}
              </h1>
              {cookbook.description && (
                <p className='text-gray-600 mb-4'>{cookbook.description}</p>
              )}
              <p className='text-gray-600 mb-2'>Created by {authorName}</p>
              {cookbook.createdAt && (
                <p className='text-sm text-gray-500'>
                  Created {new Date(cookbook.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className='flex flex-col justify-between items-end text-right min-h-[120px] ml-6'>
              <button
                onClick={handleToggleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked
                    ? 'bg-red-100 hover:bg-red-200'
                    : 'bg-gray-100 hover:bg-red-100'
                }`}
                title={isLiked ? 'Unlike Cookbook' : 'Like Cookbook'}
                style={{ width: 40, height: 40 }}
              >
                <HeartIcon filled={isLiked} size={24} />
              </button>
              <div className='flex flex-col items-end text-right'>
                <div className='text-2xl font-bold text-blue-500'>
                  {cookbook.recipes.length}
                </div>
                <div className='text-sm text-gray-600'>
                  {cookbook.recipes.length === 1 ? 'recipe' : 'recipes'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-4 px-4'>
            Recipes in this Cookbook
          </h2>

          {cookbook.recipes.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-600'>No recipes in this cookbook yet.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {cookbook.recipes.map((recipe: Recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  backTo={returnTo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CookbookDetail;
