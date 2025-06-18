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
    <RecipeForm
      onSubmit={handleSubmit}
      title='Create New Recipe'
      subtitle='Share your favorite recipe with the community'
      backTo='/recipes'
      backText='Back to Recipes'
    />
  );
}
