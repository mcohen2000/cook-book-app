import { useParams, Link, useNavigate, useLocation } from 'react-router';
import NutritionLabel from '../components/NutritionLabel';
import { useRecipe, useDeleteRecipe } from '../queries/useRecipes';
import BackButton from '../components/BackButton';
import { useAuth } from '../hooks/useAuth';
import { isAuthor as checkIsAuthor } from '../utils/isAuthor';
import { useModal } from '../context/ModalContext';
import AddToCookbookModal from '../components/modals/AddToCookbookModal';
import { useLikeRecipe, useUnlikeRecipe } from '../queries/useUsers';
import HeartIcon from '../components/icons/HeartIcon';
import BookmarkIcon from '../components/icons/BookmarkIcon';
import TrashIcon from '../components/icons/TrashIcon';
import EditIcon from '../components/icons/EditIcon';
import ClockIcon from '../components/icons/ClockIcon';
import ServingsIcon from '../components/icons/ServingsIcon';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.state?.backTo || {
    to: '/recipes',
    text: 'Back to Recipes',
  };
  const { data: recipe, isLoading, error } = useRecipe(id!);
  const deleteRecipe = useDeleteRecipe();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const isAuthor = checkIsAuthor(currentUser?.id || '', recipe?.author || '');
  const { openModal, closeModal } = useModal();
  const likeRecipe = useLikeRecipe();
  const unlikeRecipe = useUnlikeRecipe();

  // Show loading state while auth or recipe data is loading
  if (authLoading || isLoading) {
    return (
      <div className='flex flex-col justify-center items-center text-center py-8'>
        <LoadingSpinner size={24} />
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-500'>
          {error instanceof Error ? error.message : 'Recipe not found'}
        </p>
        <Link
          to='/recipes'
          className='text-blue-500 hover:text-blue-600 mt-4 inline-block'
        >
          Back to Recipes
        </Link>
      </div>
    );
  }

  // At this point, recipe is guaranteed to be defined
  const isLiked = currentUser?.likedRecipes?.includes(recipe._id);

  const handleDelete = async () => {
    try {
      await deleteRecipe.mutateAsync(id!);
      closeModal();
      navigate('/recipes');
    } catch (err) {
      // Optionally show error
      console.error('Failed to delete recipe:', err);
    }
  };

  const handleOpenDeleteModal = () => {
    openModal(
      <ConfirmDeleteModal
        itemType='recipe'
        itemName={recipe.title}
        onConfirm={handleDelete}
        loading={deleteRecipe.isPending}
      />
    );
  };

  const handleAddToCookbook = () => {
    if (!currentUser) return; // Don't open modal if user is not authenticated

    openModal(<AddToCookbookModal recipeId={id!} />);
  };

  const handleToggleLike = () => {
    if (!currentUser) return;
    if (isLiked) {
      unlikeRecipe.mutate(recipe._id);
    } else {
      likeRecipe.mutate(recipe._id);
    }
  };

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <BackButton to={backTo.to} text={backTo.text} />
        <div className='space-x-4'>
          {isAuthor && (
            <>
              <Link
                to={`/recipes/${id}/edit`}
                className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors'
              >
                <EditIcon className='w-5 h-5 mr-2' />
                Edit Recipe
              </Link>
              <button
                onClick={handleOpenDeleteModal}
                className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white transition-colors cursor-pointer'
              >
                <TrashIcon className='mr-2' />
                Delete Recipe
              </button>
            </>
          )}
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-hidden relative'>
        {/* Heart Icon Button */}
        <button
          onClick={handleToggleLike}
          className={`absolute top-4 right-16 flex items-center justify-center p-2 rounded-full transition-colors ${
            isLiked
              ? 'bg-red-100 hover:bg-red-200'
              : 'bg-gray-100 hover:bg-red-100'
          }`}
          title={isLiked ? 'Unlike Recipe' : 'Like Recipe'}
          style={{ width: 40, height: 40 }}
        >
          <HeartIcon filled={isLiked} size={24} />
        </button>
        {/* Bookmark Icon Button */}
        <button
          onClick={handleAddToCookbook}
          className='absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors'
          title='Add to Cookbook'
        >
          <BookmarkIcon size={24} />
        </button>
        <div className='p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {recipe.title}
          </h1>
          <p className='text-gray-600 mb-8'>{recipe.description}</p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Left Column - Recipe Details */}
            <div className='space-y-6'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  Ingredients
                </h2>
                <ul className='space-y-2'>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className='flex items-center'>
                      <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                      <span className='text-gray-700'>
                        {ingredient.amount} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  Instructions
                </h2>
                <ol className='space-y-4'>
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className='flex items-start'>
                      <span className='flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium mr-3 mt-0.5'>
                        {index + 1}
                      </span>
                      <span className='text-gray-700 mt-1.5'>
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right Column - Nutrition Label */}
            <NutritionLabel servings={recipe.servings} />
          </div>

          <div className='mt-8 flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center'>
              <ClockIcon className='w-5 h-5 mr-2' />
              Cooking Time: {recipe.cookingTime}{' '}
              {recipe.cookingTime === 1 ? 'minute' : 'minutes'}
            </div>
            <div className='flex items-center'>
              <ServingsIcon className='w-5 h-5 mr-2' />
              Servings: {recipe.servings}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
