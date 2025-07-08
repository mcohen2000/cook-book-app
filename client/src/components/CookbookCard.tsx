import { Link } from 'react-router';
import type { Book } from '../types/book';
import BookIcon from './icons/BookIcon';
import UserIcon from './icons/UserIcon';

interface CookbookCardProps {
  cookbook: Book;
}

const CookbookCard = ({ cookbook }: CookbookCardProps) => {
  // Get author name (could be string or User object)
  const authorName =
    typeof cookbook.author === 'string'
      ? cookbook.author
      : cookbook.author.name;

  return (
    <Link to={`/cookbooks/${cookbook._id}`} className='block'>
      <div className='bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
        <div className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {cookbook.title}
          </h3>
          {cookbook.description && (
            <p className='text-gray-700 text-sm mb-2 line-clamp-2'>
              {cookbook.description}
            </p>
          )}
          <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
            <div className='flex items-center'>
              <BookIcon className='w-4 h-4 mr-1' />
              {cookbook.recipes.length}{' '}
              {cookbook.recipes.length === 1 ? 'recipe' : 'recipes'}
            </div>
            <div className='flex items-center'>
              <UserIcon className='w-4 h-4 mr-1' />
              {authorName}
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
