import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  cookingTime: number;
  servings: number;
  createdAt: string;
}

export default function BrowsePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (search: string = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3001/api/recipes${
          search ? `?search=${encodeURIComponent(search)}` : ''
        }`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(searchQuery);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>Recipes</h2>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search recipes...'
            className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading recipes...</p>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <p className='text-red-500'>{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>No recipes found</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {recipes.map((recipe) => (
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
  );
}
