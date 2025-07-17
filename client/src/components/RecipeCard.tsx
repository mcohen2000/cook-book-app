import { Link } from 'react-router';
import ClockIcon from './icons/ClockIcon';
import ServingsIcon from './icons/ServingsIcon';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
}

const RecipeCard = ({
  id,
  title,
  description,
  cookingTime,
  servings,
}: RecipeCardProps) => {
  return (
    <Link to={`/recipes/${id}`} className='block'>
      <div className='bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200'>
        <div className='p-6 h-[200px] flex flex-col justify-between'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
            <p className='text-gray-600 mb-4 line-clamp-2'>{description}</p>
          </div>
          <div className='flex items-center justify-between text-sm text-gray-500'>
            <div className='flex items-center'>
              <ClockIcon className='w-4 h-4 mr-1' />
              {cookingTime} min
            </div>
            <div className='flex items-center'>
              <ServingsIcon className='w-4 h-4 mr-1' />
              {servings} servings
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
