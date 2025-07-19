import { useSearchParams } from 'react-router';
import { useCookbooks } from '../queries/useBooks';
import CookbookCard from '../components/CookbookCard';
import SearchForm from '../components/SearchForm';
import type { Book } from '../types/book';

const BrowseCookbooks = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const {
    data: books = [],
    isLoading,
    error,
    isFetching,
  } = useCookbooks({ search });

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center px-4'>
        <h2 className='text-2xl font-bold text-gray-900'>Cookbooks</h2>
      </div>

      {/* Search Bar */}
      <SearchForm placeholder='Search cookbooks by title or description' />

      {isLoading || isFetching ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading cookbooks...</p>
        </div>
      ) : error ? (
        <div className='text-center py-8'>
          <p className='text-red-500'>{(error as Error).message}</p>
        </div>
      ) : books.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600'>
            {search
              ? `No cookbooks found matching "${search}".`
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
