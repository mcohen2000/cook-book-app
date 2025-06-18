import { useParams, Link, useNavigate } from 'react-router';
import NutritionLabel from '../components/NutritionLabel';
import { useRecipe, useDeleteRecipe } from '../queries/useRecipes';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(id!);
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    try {
      await deleteRecipe.mutateAsync(id!);
      navigate('/recipes');
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  if (isLoading) {
    return (
      <div className='text-center py-8'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
        <p className='mt-2 text-gray-600'>Loading recipe...</p>
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

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <Link
          to='/recipes'
          className='text-gray-600 hover:text-blue-600 inline-flex items-center transition-colors'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
          Back to Recipes
        </Link>
        <div className='space-x-4'>
          <Link
            to={`/recipes/${id}/edit`}
            className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
            Edit Recipe
          </Link>
          <button
            onClick={handleDelete}
            className='inline-flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white transition-colors'
          >
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
            Delete Recipe
          </button>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
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
                    <li key={index} className='flex'>
                      <span className='flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium mr-3'>
                        {index + 1}
                      </span>
                      <span className='text-gray-700'>{instruction}</span>
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
              <svg
                className='w-5 h-5 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Cooking Time: {recipe.cookingTime} minutes
            </div>
            <div className='flex items-center'>
              <svg
                className='w-5 h-5 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              Servings: {recipe.servings}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
