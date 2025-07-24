import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/ProfileForm';
import { useCookbooks } from '../queries/useBooks';
import { useRecipes } from '../queries/useRecipes';
import { useLikedContent } from '../queries/useUsers';
import type { Recipe } from '../types/recipe';
import type { Book } from '../types/book';
import RecipeCard from '../components/RecipeCard';
import CookbookCard from '../components/CookbookCard';

const Profile = () => {
  const { user } = useAuth();
  const { data: cookbooks = [], isLoading: loadingCookbooks } = useCookbooks({
    userId: user?.id,
  });
  const { data: recipesData, isLoading: loadingRecipes } = useRecipes({
    search: '',
    userId: user?.id,
  });
  const recipes = recipesData?.recipes ?? [];
  const { data: likedContent, isLoading: loadingLikedContent } =
    useLikedContent();

  const handleProfileUpdate = () => {
    // This callback can be used for any additional actions after profile update
    // For now, it's just a placeholder
  };

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

      {/* Profile Info Card */}
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <div className='space-y-6'>
          {/* Avatar Section */}
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {user.name}
              </h2>
              <p className='text-gray-600'>{user.email}</p>
            </div>
          </div>

          {/* Name Edit Section */}
          <ProfileForm
            currentName={user.name}
            onSuccess={handleProfileUpdate}
          />

          {/* Email Section (Read-only) */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Email</h3>
            <p className='text-gray-700'>{user.email}</p>
            <p className='text-sm text-gray-500 mt-1'>
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Cookbooks Section */}
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Your Cookbooks
        </h3>
        {loadingCookbooks ? (
          <p className='text-gray-500'>Loading cookbooks...</p>
        ) : cookbooks.length === 0 ? (
          <p className='text-gray-500'>No cookbooks found.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {cookbooks.map((book) => (
              <CookbookCard key={book._id} cookbook={book} />
            ))}
          </div>
        )}
      </div>

      {/* Recipes Section */}
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Your Recipes</h3>
        {loadingRecipes ? (
          <p className='text-gray-500'>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p className='text-gray-500'>No recipes found.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                id={recipe._id}
                title={recipe.title}
                description={recipe.description}
                cookingTime={recipe.cookingTime}
                servings={recipe.servings}
              />
            ))}
          </div>
        )}
      </div>

      {/* Liked Content Section */}
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Liked Content
        </h3>
        {loadingLikedContent ? (
          <p className='text-gray-500'>Loading liked content...</p>
        ) : (
          <div className='space-y-6'>
            {/* Liked Recipes */}
            <div>
              <h4 className='text-md font-medium text-gray-800 mb-3'>
                Liked Recipes
              </h4>
              {likedContent?.likedRecipes &&
              likedContent.likedRecipes.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {likedContent.likedRecipes.map((recipe: Recipe) => (
                    <RecipeCard
                      key={recipe._id}
                      id={recipe._id}
                      title={recipe.title}
                      description={recipe.description}
                      cookingTime={recipe.cookingTime}
                      servings={recipe.servings}
                    />
                  ))}
                </div>
              ) : (
                <p className='text-gray-500'>No liked recipes yet.</p>
              )}
            </div>

            {/* Liked Cookbooks */}
            <div>
              <h4 className='text-md font-medium text-gray-800 mb-3'>
                Liked Cookbooks
              </h4>
              {likedContent?.likedCookbooks &&
              likedContent.likedCookbooks.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {likedContent.likedCookbooks.map((cookbook: Book) => (
                    <CookbookCard key={cookbook._id} cookbook={cookbook} />
                  ))}
                </div>
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
