type RecipeCardProps = {
  title: string;
  description: string;
}

const RecipeCard = ({ title, description }: RecipeCardProps) => {
  return (
    <div className='bg-white shadow rounded-lg overflow-hidden'>
      <div className='p-6'>
        <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
        <p className='mt-2 text-gray-600'>{description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
