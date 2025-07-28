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

const Profile = () => {
  const { user } = useAuth();
  const { data: cookbooksData, isLoading: loadingCookbooks } = useCookbooks({
    userId: user?.id,
  });
  const cookbooks = cookbooksData?.books ?? [];
  const { data: recipesData, isLoading: loadingRecipes } = useRecipes({
    search: '',
    userId: user?.id,
  });
  const recipes = recipesData?.recipes ?? [];
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
        {loadingCookbooks ? (
          <p className='text-gray-500'>Loading cookbooks...</p>
        ) : cookbooks.length === 0 ? (
          <p className='text-gray-500'>No cookbooks found.</p>
        ) : (
          <Carousel className='w-full'>
            <CarouselContent className='p-6'>
              {cookbooks.map((book) => (
                <CarouselItem
                  className={`${handleCarouselItemSize(cookbooks.length)}`}
                >
                  <CookbookCard key={book._id} cookbook={book} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={`${hideCarouselBtns(cookbooks.length)}`}
            />
            <CarouselNext className={`${hideCarouselBtns(cookbooks.length)}`} />
          </Carousel>
        )}
      </div>

      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Your Recipes</h3>
        {loadingRecipes ? (
          <p className='text-gray-500'>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className='text-gray-500'>No recipes found.</p>
        ) : (
          <Carousel className='w-full'>
            <CarouselContent className='p-6'>
              {recipes.map((recipe) => (
                <CarouselItem
                  className={`${handleCarouselItemSize(recipes.length)}`}
                >
                  <RecipeCard
                    key={recipe._id}
                    id={recipe._id}
                    title={recipe.title}
                    description={recipe.description}
                    cookingTime={recipe.cookingTime}
                    servings={recipe.servings}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              className={`${hideCarouselBtns(recipes.length)}`}
            />
            <CarouselNext className={`${hideCarouselBtns(recipes.length)}`} />
          </Carousel>
        )}
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
                        className={`${handleCarouselItemSize(
                          likedContent.likedRecipes.length
                        )}`}
                      >
                        <RecipeCard
                          key={recipe._id}
                          id={recipe._id}
                          title={recipe.title}
                          description={recipe.description}
                          cookingTime={recipe.cookingTime}
                          servings={recipe.servings}
                        />
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
                        className={`${handleCarouselItemSize(
                          likedContent.likedCookbooks.length
                        )}`}
                      >
                        <CookbookCard key={cookbook._id} cookbook={cookbook} />
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
