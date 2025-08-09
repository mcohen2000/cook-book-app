import { useParams, useNavigate, Link } from 'react-router';
import RecipeForm from '../components/RecipeForm';
import { useRecipe, useUpdateRecipe } from '../queries/useRecipes';
import type { Recipe } from '../types/recipe';
import LoadingSpinner from '../components/LoadingSpinner';

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
      <div className='flex flex-col justify-center items-center text-center py-8'>
        <LoadingSpinner size={24} />
        <p className='mt-4 text-gray-600'>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-500'>
          {error instanceof Error ? error.message : 'Recipe not found'}
        </p>
        <Link to='/recipes' className='text-blue-500 hover:text-blue-600 mt-4'>
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <RecipeForm
      onSubmit={handleSubmit}
      initialRecipe={recipe}
      isEditing={true}
      title='Edit Recipe'
      subtitle='Update your recipe details'
      backTo={`/recipes/${id}`}
      backText='Back to Recipe'
    />
  );
}
