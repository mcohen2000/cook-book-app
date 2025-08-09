import { Link } from 'react-router';
import { useRecipes } from '../queries/useRecipes';
import { useCookbooks } from '../queries/useBooks';
import RecipeCard from '../components/RecipeCard';
import CookbookCard from '../components/CookbookCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/Carousel';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const { data: recipes, isLoading: isLoadingRecipes } = useRecipes({
    count: 6,
  });
  const { data: cookbooks, isLoading: isLoadingCookbooks } = useCookbooks({
    count: 6,
  });

  return (
    <div className='space-y-12'>
      <section className='text-center py-20 bg-gray-50 rounded-lg px-4'>
        <h1 className='text-5xl font-bold text-gray-900 mb-4'>
          Welcome to The Cook Book
        </h1>
        <p className='text-xl text-gray-600 mb-8'>
          Discover, create, and share your culinary masterpieces.
        </p>
        <div className='flex justify-center gap-4'>
          <Link
            to='/recipes'
            className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      <section className='px-4'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Featured Recipes
        </h2>
        {isLoadingRecipes ? (
          <div className='w-full flex justify-center items-center'>
            <LoadingSpinner size={24} />
          </div>
        ) : (
          <Carousel>
            <CarouselContent>
              {recipes?.recipes.map((recipe) => (
                <CarouselItem
                  key={recipe._id}
                  className='md:basis-1/2 lg:basis-1/3'
                >
                  <RecipeCard recipe={recipe} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </section>

      <section className='px-4'>
        <h2 className='text-3xl font-bold text-gray-900 mb-6'>
          Featured Cookbooks
        </h2>
        {isLoadingCookbooks ? (
          <div className='w-full flex justify-center items-center'>
            <LoadingSpinner size={24} />
          </div>
        ) : (
          <Carousel>
            <CarouselContent>
              {cookbooks?.books.map((book) => (
                <CarouselItem
                  key={book._id}
                  className='md:basis-1/2 lg:basis-1/3'
                >
                  <CookbookCard book={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </section>

      <section className='text-center py-16 bg-blue-50 rounded-lg px-4'>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          Share Your Own Recipes
        </h2>
        <p className='text-lg text-gray-600 mb-8'>
          Join our community of food lovers and share your creations with the
          world.
        </p>

        <Link
          to='/register'
          className='px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
        >
          Create an Account
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
