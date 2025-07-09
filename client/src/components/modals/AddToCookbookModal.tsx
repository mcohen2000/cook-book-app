import React, { useState } from 'react';
import {
  useUserCookbooks,
  useCreateCookbook,
  useAddRecipeToCookbook,
  useRemoveRecipeFromCookbook,
} from '../../queries/useBooks';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';

interface AddToCookbookModalProps {
  recipeId: string;
}

const AddToCookbookModal: React.FC<AddToCookbookModalProps> = ({
  recipeId,
}) => {
  const { data: cookbooks = [] } = useUserCookbooks();
  const createCookbook = useCreateCookbook();
  const addRecipeToCookbook = useAddRecipeToCookbook();
  const removeRecipeFromCookbook = useRemoveRecipeFromCookbook();
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCookbookTitle, setNewCookbookTitle] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Since we're now using useUserCookbooks, we don't need to filter by author
  const userCookbooks = cookbooks;

  const handleToggleCookbook = async (cookbookId: string) => {
    const cookbook = userCookbooks.find((book) => book._id === cookbookId);
    if (!cookbook) return;

    const hasRecipe = cookbook.recipes.includes(recipeId);

    try {
      if (hasRecipe) {
        // Remove recipe from cookbook
        await removeRecipeFromCookbook.mutateAsync({
          cookbookId,
          recipeId,
        });
      } else {
        // Add recipe to cookbook
        await addRecipeToCookbook.mutateAsync({
          cookbookId,
          recipeId,
        });
      }
    } catch (err) {
      setError(
        `Failed to ${
          hasRecipe ? 'remove' : 'add'
        } recipe from cookbook. Please try again.`
      );
      setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
    }
  };

  // Create new cookbook, then add recipe to it
  const handleCreateNew = async () => {
    if (!newCookbookTitle.trim()) {
      setError('Please enter a title for the new cookbook.');
      return;
    }
    setError('');
    setCreating(true);
    try {
      // Create new cookbook with recipe
      await createCookbook.mutateAsync({ title: newCookbookTitle, recipeId });
      setShowNewInput(false);
      setNewCookbookTitle('');
    } catch (err) {
      setError('Failed to create cookbook. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelNew = () => {
    setShowNewInput(false);
    setNewCookbookTitle('');
    setError('');
  };

  const isLoading =
    createCookbook.isPending ||
    addRecipeToCookbook.isPending ||
    removeRecipeFromCookbook.isPending ||
    creating;

  return (
    <div style={{ minWidth: 300 }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
        Manage Cookbooks
      </h2>

      {/* User's Cookbooks */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Your Cookbooks:
        </label>
        {userCookbooks.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            You don't have any cookbooks yet.
          </p>
        ) : (
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {userCookbooks.map((cookbook) => {
              const hasRecipe = cookbook.recipes.includes(recipeId);

              return (
                <label
                  key={cookbook._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={hasRecipe}
                    onChange={() =>
                      !isLoading && handleToggleCookbook(cookbook._id)
                    }
                    disabled={isLoading}
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ fontSize: 14 }}>{cookbook.title}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* New Cookbook Input */}
      <div style={{ marginBottom: 16 }}>
        <button
          type='button'
          onClick={() => setShowNewInput(!showNewInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            fontSize: 14,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          disabled={isLoading}
        >
          + Create New Cookbook
        </button>
        {showNewInput && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <input
              type='text'
              value={newCookbookTitle}
              onChange={(e) => setNewCookbookTitle(e.target.value)}
              placeholder='New cookbook title'
              style={{ flex: 1, padding: 8 }}
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={handleCreateNew}
              style={{
                marginLeft: 8,
                background: 'none',
                border: 'none',
                color: '#22c55e',
                fontSize: 22,
                cursor: creating ? 'not-allowed' : 'pointer',
              }}
              disabled={isLoading}
              title='Create'
            >
              <CheckIcon className='w-[22px] h-[22px]' />
            </button>
            <button
              type='button'
              onClick={handleCancelNew}
              style={{
                marginLeft: 4,
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: 22,
                cursor: creating ? 'not-allowed' : 'pointer',
              }}
              disabled={isLoading}
              title='Cancel'
            >
              <XIcon className='w-[22px] h-[22px]' />
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
    </div>
  );
};

export default AddToCookbookModal;
