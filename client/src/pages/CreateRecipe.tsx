import { useNavigate } from 'react-router';
import RecipeForm from '../components/RecipeForm';
import { useCreateRecipe } from '../queries/useRecipes';
import type { Recipe } from '../types/recipe';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const handleSubmit = async (recipe: Omit<Recipe, '_id'>) => {
    try {
      await createRecipe.mutateAsync(recipe);
      navigate('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Create New Recipe
          </h1>
          <p className='mt-2 text-gray-600'>
            Share your favorite recipe with the community
          </p>
        </div>
        <RecipeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
