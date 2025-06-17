import { useNavigate } from 'react-router';
import RecipeForm from '../components/RecipeForm';

interface CreateRecipe {
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  cookingTime: number;
  servings: number;
}

export default function CreateRecipe() {
  const navigate = useNavigate();

  const handleSubmit = async (recipe: CreateRecipe) => {
    try {
      const response = await fetch('http://localhost:3001/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        navigate('/recipes');
      } else {
        console.error('Failed to create recipe');
      }
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
