import { useSearchParams } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import SearchForm from '../components/SearchForm';
import { useRecipes } from '../queries/useRecipes';

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
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const {
    data: recipes = [],
    isLoading,
    error,
    isFetching,
  } = useRecipes(search);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center px-4'>
        <h2 className='text-2xl font-bold text-gray-900'>Recipes</h2>
      </div>

      {/* Search Bar */}
      <SearchForm placeholder='Search recipes...' />

      {isLoading || isFetching ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading recipes...</p>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <p className='text-red-500'>{(error as Error).message}</p>
        </div>
      ) : (recipes as Recipe[]).length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>No recipes found</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4'>
          {(recipes as Recipe[]).map((recipe: Recipe) => (
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
