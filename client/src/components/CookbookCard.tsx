import { Link } from 'react-router';
import type { Book } from '../types/book';
import BookIcon from './icons/BookIcon';
import UserIcon from './icons/UserIcon';

interface CookbookCardProps {
  book: Book;
  backTo?: { to: string; text: string };
}

const CookbookCard = ({ book, backTo }: CookbookCardProps) => {
  // Get author name (could be string or User object)
  const authorName =
    typeof book.author === 'string' ? book.author : book.author.name;

  return (
    <Link to={`/cookbooks/${book._id}`} className='block' state={{ backTo }}>
      <div className='bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
        <div className='p-6 h-[200px] flex flex-col justify-between'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {book.title}
            </h3>
            {book.description && (
              <p className='text-gray-700 text-sm mb-2 line-clamp-2'>
                {book.description}
              </p>
            )}
          </div>
          <div>
            <div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
              <div className='flex items-center'>
                <BookIcon className='w-4 h-4 mr-1' />
                {book.recipes.length}{' '}
                {book.recipes.length === 1 ? 'recipe' : 'recipes'}
              </div>
              <div className='flex items-center'>
                <UserIcon className='w-4 h-4 mr-1' />
                {authorName}
              </div>
            </div>
            {book.createdAt && (
              <div className='text-xs text-gray-400'>
                Created {new Date(book.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CookbookCard;
