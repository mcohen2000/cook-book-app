import { useParams, useNavigate, Link } from 'react-router';
import RecipeForm from '../components/RecipeForm';
import { useRecipe, useUpdateRecipe } from '../queries/useRecipes';
import type { Recipe } from '../types/recipe';

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipe(id!);
  const updateRecipe = useUpdateRecipe();

  const handleSubmit = async (updatedRecipe: Omit<Recipe, '_id'>) => {
    try {
      await updateRecipe.mutateAsync({ id: id!, recipe: updatedRecipe });
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Failed to update recipe:', err);
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
        <button
          onClick={() => navigate('/recipes')}
          className='text-blue-500 hover:text-blue-600 mt-4'
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Recipe</h1>
          <p className='mt-2 text-gray-600'>Update your recipe details</p>
        </div>
        <div className='max-w-3xl mx-auto'>
          <Link
            to={`/recipes/${id}`}
            className='inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4'
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
            Back to Recipe
          </Link>
          <RecipeForm
            onSubmit={handleSubmit}
            initialRecipe={recipe}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
