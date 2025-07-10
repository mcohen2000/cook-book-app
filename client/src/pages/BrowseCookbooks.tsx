import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useCookbooks } from '../queries/useBooks';
import CookbookCard from '../components/CookbookCard';
import type { Book } from '../types/book';

const BrowseCookbooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const { data: books = [], isLoading, error } = useCookbooks({ search });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900 px-4'>Cookbooks</h2>
        </div>
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading cookbooks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-gray-900 px-4'>Cookbooks</h2>
        </div>
        <div className='text-center py-8'>
          <p className='text-red-500'>{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center px-4'>
        <h2 className='text-2xl font-bold text-gray-900'>Cookbooks</h2>
      </div>

      {/* Search Bar */}
      <div className='px-4'>
        <form onSubmit={handleSearch} className='flex gap-2'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search cookbooks by title or description'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <button
            type='submit'
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Search
          </button>
          {searchQuery && (
            <button
              type='button'
              onClick={handleClearSearch}
              className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {books.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>
            {searchQuery
              ? `No cookbooks found matching "${searchQuery}".`
              : 'No cookbooks found. Be the first to create one!'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4'>
          {books.map((book: Book) => (
            <CookbookCard key={book._id} cookbook={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCookbooks;
