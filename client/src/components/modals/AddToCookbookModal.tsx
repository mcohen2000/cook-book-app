import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  useCookbooks,
  useCreateCookbook,
  useAddRecipeToCookbook,
} from '../../queries/useBooks';

interface AddToCookbookModalProps {
  recipeId: string;
  onClose?: () => void;
}

const AddToCookbookModal: React.FC<AddToCookbookModalProps> = ({
  recipeId,
  onClose,
}) => {
  const { user: currentUser } = useAuth();
  const { data: cookbooks = [] } = useCookbooks();
  const createCookbook = useCreateCookbook();
  const addRecipeToCookbook = useAddRecipeToCookbook();
  const [selectedCookbooks, setSelectedCookbooks] = useState<string[]>([]);
  const [showNewInput, setShowNewInput] = useState(false);
  const [newCookbookTitle, setNewCookbookTitle] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Memoize filtered cookbooks to prevent infinite re-renders
  const userCookbooks = useMemo(
    () => cookbooks.filter((book) => book.author === currentUser?.id),
    [cookbooks, currentUser?.id]
  );

  // Find cookbooks that already contain this recipe
  const cookbooksWithRecipe = useMemo(
    () => userCookbooks.filter((book) => book.recipes.includes(recipeId)),
    [userCookbooks, recipeId]
  );

  // Initialize selected cookbooks with cookbooks that don't already have the recipe
  useEffect(() => {
    const availableCookbooks = userCookbooks.filter(
      (book) => !book.recipes.includes(recipeId)
    );
    setSelectedCookbooks(availableCookbooks.map((book) => book._id));
  }, [userCookbooks, recipeId]);

  const handleCheckboxChange = (cookbookId: string) => {
    setSelectedCookbooks((prev) =>
      prev.includes(cookbookId)
        ? prev.filter((id) => id !== cookbookId)
        : [...prev, cookbookId]
    );
    setError('');
  };

  // Create new cookbook, then select it
  const handleCreateNew = async () => {
    if (!newCookbookTitle.trim()) {
      setError('Please enter a title for the new cookbook.');
      return;
    }
    setError('');
    setCreating(true);
    try {
      // Create new cookbook
      const result = await createCookbook.mutateAsync({
        title: newCookbookTitle,
        recipeId,
      });
      if (result?._id) {
        setSelectedCookbooks((prev) => [...prev, result._id]);
        setShowNewInput(false);
        setNewCookbookTitle('');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCancelNew = () => {
    setShowNewInput(false);
    setNewCookbookTitle('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCookbooks.length === 0) {
      setError('Please select at least one cookbook.');
      return;
    }
    setError('');

    try {
      // Add to cookbooks using the unified function
      await addRecipeToCookbook.mutateAsync({
        recipeId,
        cookbookIds: selectedCookbooks,
      });
      if (onClose) onClose();
    } catch (err) {
      setError('Failed to add recipe to cookbooks. Please try again.');
    }
  };

  const isLoading =
    createCookbook.isPending || addRecipeToCookbook.isPending || creating;

  return (
    <form onSubmit={handleSubmit} style={{ minWidth: 300 }}>
      <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
        Add to Cookbook
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
              const alreadyHasRecipe = cookbook.recipes.includes(recipeId);
              const isSelected = selectedCookbooks.includes(cookbook._id);

              return (
                <label
                  key={cookbook._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    cursor: alreadyHasRecipe ? 'default' : 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={alreadyHasRecipe || isSelected}
                    onChange={() =>
                      !alreadyHasRecipe && handleCheckboxChange(cookbook._id)
                    }
                    disabled={isLoading || alreadyHasRecipe}
                    style={{ marginRight: 8 }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: alreadyHasRecipe ? '#6b7280' : 'inherit',
                      fontStyle: alreadyHasRecipe ? 'italic' : 'normal',
                    }}
                  >
                    {cookbook.title}
                    {alreadyHasRecipe && (
                      <span style={{ color: '#22c55e', marginLeft: 4 }}>✓</span>
                    )}
                  </span>
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
              {/* Checkmark icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                width={22}
                height={22}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
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
              {/* X icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                width={22}
                height={22}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button
        type='submit'
        style={{
          width: '100%',
          padding: 10,
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
        disabled={isLoading}
      >
        {isLoading
          ? 'Adding...'
          : `Add to ${selectedCookbooks.length} cookbook${
              selectedCookbooks.length !== 1 ? 's' : ''
            }`}
      </button>
    </form>
  );
};

export default AddToCookbookModal;
