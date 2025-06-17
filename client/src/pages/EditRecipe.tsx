import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import RecipeForm from '../components/RecipeForm';

interface Recipe {
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  cookingTime: number;
  servings: number;
}

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3001/api/recipes/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (updatedRecipe: Recipe) => {
    try {
      const response = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
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
        <p className='text-red-500'>{error || 'Recipe not found'}</p>
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
        <RecipeForm
          onSubmit={handleSubmit}
          initialRecipe={recipe}
          isEditing={true}
        />
      </div>
    </div>
  );
}
