import { useParams } from 'react-router';
import { useCookbook } from '../queries/useBooks';
import RecipeCard from '../components/RecipeCard';
import type { Recipe } from '../types/book';

const CookbookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: cookbook,
    isLoading: cookbookLoading,
    error: cookbookError,
  } = useCookbook(id!);

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

  // Get author name (could be string or User object)
  const authorName =
    typeof cookbook.author === 'string'
      ? cookbook.author
      : cookbook.author.name;

  return (
    <div className='space-y-6'>
      {/* Cookbook Header */}
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {cookbook.title}
            </h1>
            <p className='text-gray-600 mb-2'>Created by {authorName}</p>
            {cookbook.createdAt && (
              <p className='text-sm text-gray-500'>
                Created {new Date(cookbook.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-blue-500'>
              {cookbook.recipes.length}
            </div>
            <div className='text-sm text-gray-600'>
              {cookbook.recipes.length === 1 ? 'recipe' : 'recipes'}
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
                id={recipe._id}
                title={recipe.title}
                description={recipe.description}
                cookingTime={recipe.cookingTime}
                servings={recipe.servings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CookbookDetail;
