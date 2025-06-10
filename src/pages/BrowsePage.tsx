import RecipeCard from '../components/RecipeCard';

const BrowsePage = () => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-gray-900'>Recipes</h2>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <RecipeCard
          title='Sample Recipe'
          description='This is where recipe details will be displayed'
        />
      </div>
    </div>
  );
};

export default BrowsePage;
