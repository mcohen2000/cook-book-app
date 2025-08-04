import { useAuth } from '../hooks/useAuth';
import { useCookbooks } from '../queries/useBooks';
import { useRecipes } from '../queries/useRecipes';
import { useLikedContent } from '../queries/useUsers';
import type { Recipe } from '../types/recipe';
import type { Book } from '../types/book';
import RecipeCard from '../components/RecipeCard';
import CookbookCard from '../components/CookbookCard';
import ProfileDisplay from '../components/ProfileDisplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/Carousel';
import PaginatedCarousel from '../components/PaginatedCarousel';

const Profile = () => {
  const { user } = useAuth();

  const { data: likedContent, isLoading: loadingLikedContent } =
    useLikedContent();

  const handleCarouselItemSize = (arrLength: number) =>
    arrLength >= 3
      ? 'md:basis-1/2 lg:basis-1/3'
      : arrLength === 2
      ? 'md:basis-1/2'
      : '';

  const hideCarouselBtns = (arrLength: number) =>
    arrLength === 3
      ? 'flex lg:hidden'
      : arrLength === 2
      ? 'flex md:hidden'
      : arrLength <= 1
      ? 'hidden'
      : '';

  const returnTo = { to: '/profile', text: 'Back to Profile' };

  if (!user) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <p className='text-red-500'>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900 px-4'>Profile</h1>
      </div>

      <ProfileDisplay user={user} />

      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Your Cookbooks
        </h3>
        <PaginatedCarousel
          useQuery={useCookbooks}
          userId={user?.id}
          Card={CookbookCard}
          cardProps={{ type: 'book', returnTo }}
          preloadOffset={4}
          itemSize={handleCarouselItemSize}
          hideBtns={hideCarouselBtns}
        />
      </div>

      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Your Recipes</h3>
        <PaginatedCarousel
          useQuery={useRecipes}
          userId={user?.id}
          Card={RecipeCard}
          cardProps={{ type: 'recipe', returnTo }}
          preloadOffset={4}
          itemSize={handleCarouselItemSize}
          hideBtns={hideCarouselBtns}
        />
      </div>

      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Liked Content
        </h3>
        {loadingLikedContent ? (
          <p className='text-gray-500'>Loading liked content...</p>
        ) : (
          <div className='space-y-6'>
            <div>
              <h4 className='text-md font-medium text-gray-800 mb-3'>
                Recipes
              </h4>
              {likedContent?.likedRecipes &&
              likedContent.likedRecipes.length > 0 ? (
                <Carousel className='w-full'>
                  <CarouselContent className='p-6'>
                    {likedContent.likedRecipes.map((recipe: Recipe) => (
                      <CarouselItem
                        key={`likedRecipe-${recipe._id}`}
                        className={`${handleCarouselItemSize(
                          likedContent.likedRecipes.length
                        )}`}
                      >
                        <RecipeCard recipe={recipe} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    className={`${hideCarouselBtns(
                      likedContent.likedRecipes.length
                    )}`}
                  />
                  <CarouselNext
                    className={`${hideCarouselBtns(
                      likedContent.likedRecipes.length
                    )}`}
                  />
                </Carousel>
              ) : (
                <p className='text-gray-500'>No liked recipes yet.</p>
              )}
            </div>

            <div>
              <h4 className='text-md font-medium text-gray-800 mb-3'>
                Cookbooks
              </h4>
              {likedContent?.likedCookbooks &&
              likedContent.likedCookbooks.length > 0 ? (
                <Carousel className='w-full'>
                  <CarouselContent className='p-6'>
                    {likedContent.likedCookbooks.map((cookbook: Book) => (
                      <CarouselItem
                        key={`likedBook-${cookbook._id}`}
                        className={`${handleCarouselItemSize(
                          likedContent.likedCookbooks.length
                        )}`}
                      >
                        <CookbookCard book={cookbook} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious
                    className={`${hideCarouselBtns(
                      likedContent.likedCookbooks.length
                    )}`}
                  />
                  <CarouselNext
                    className={`${hideCarouselBtns(
                      likedContent.likedCookbooks.length
                    )}`}
                  />
                </Carousel>
              ) : (
                <p className='text-gray-500'>No liked cookbooks yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
