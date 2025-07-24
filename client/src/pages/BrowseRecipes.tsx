import { useSearchParams, useNavigate } from 'react-router';
import RecipeCard from '../components/RecipeCard';
import SearchForm from '../components/SearchForm';
import { useRecipes } from '../queries/useRecipes';
import type { Recipe } from '../types/recipe';

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, error, isFetching } = useRecipes({ search, page });

  const recipes: Recipe[] = data?.recipes ?? [];
  const totalPages: number = data?.totalPages ?? 1;
  const currentPage: number = data?.page ?? 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    navigate({ search: params.toString() });
  };

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
      ) : recipes.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>No recipes found</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4'>
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
          {/* Pagination Controls */}
          <div className='flex justify-center items-center gap-4 mt-8'>
            <button
              className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${
                currentPage <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label='Previous page'
            >
              &larr; Previous
            </button>
            <span className='mx-2 text-gray-700 font-semibold text-lg select-none'>
              Page {currentPage} <span className='text-gray-400'>/</span>{' '}
              {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-gray-700 font-medium transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 ${
                currentPage >= totalPages
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label='Next page'
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
