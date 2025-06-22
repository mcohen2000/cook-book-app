import { Link } from 'react-router';
import type { Book } from '../types/book';

interface CookbookCardProps {
  cookbook: Book;
}

const CookbookCard = ({ cookbook }: CookbookCardProps) => {
  return (
    <Link to={`/cookbooks/${cookbook._id}`} className='block'>
      <div className='bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
        <div className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {cookbook.title}
          </h3>
          <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              {cookbook.recipes.length} recipes
            </div>
            <div className='flex items-center'>
              <svg
                className='w-4 h-4 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              {cookbook.author}
            </div>
          </div>
          {cookbook.createdAt && (
            <div className='text-xs text-gray-400'>
              Created {new Date(cookbook.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CookbookCard;
