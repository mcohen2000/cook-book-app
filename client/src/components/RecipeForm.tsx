import { useState, useEffect } from 'react';

interface BaseRecipe {
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  cookingTime: number;
  servings: number;
}

interface CreateRecipe extends BaseRecipe {}

interface EditRecipe extends BaseRecipe {
  _id: string;
}

type Recipe = CreateRecipe | EditRecipe;

interface RecipeFormProps {
  onSubmit: (recipe: Recipe) => void;
  initialRecipe?: Recipe;
  isEditing?: boolean;
}

export default function RecipeForm({
  onSubmit,
  initialRecipe,
  isEditing = false,
}: RecipeFormProps) {
  const [recipe, setRecipe] = useState<Recipe>(() => {
    if (initialRecipe) {
      return initialRecipe;
    }
    return {
      title: '',
      description: '',
      ingredients: [{ name: '', amount: '' }],
      instructions: [''],
      cookingTime: 30,
      servings: 4,
    };
  });

  useEffect(() => {
    if (initialRecipe) {
      setRecipe(initialRecipe);
    }
  }, [initialRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(recipe);
  };

  const updateIngredient = (
    index: number,
    field: 'name' | 'amount',
    value: string
  ) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setRecipe({
      ...recipe,
      instructions: [...recipe.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto'
    >
      <div className='space-y-8'>
        {/* Basic Info Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
            Basic Information
          </h2>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Title
            </label>
            <input
              type='text'
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter recipe title'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              value={recipe.description}
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Describe your recipe'
              rows={4}
              required
            />
          </div>
        </div>

        {/* Ingredients Section */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center border-b pb-2'>
            <h2 className='text-xl font-semibold text-gray-900'>Ingredients</h2>
            <button
              type='button'
              onClick={addIngredient}
              className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200'
            >
              + Add Ingredient
            </button>
          </div>
          <div className='space-y-3'>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className='flex gap-4'>
                <div className='flex-1'>
                  <input
                    type='text'
                    placeholder='Ingredient name'
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, 'name', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                <div className='flex-1'>
                  <input
                    type='text'
                    placeholder='Amount'
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(index, 'amount', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                {recipe.ingredients.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeIngredient(index)}
                    className='text-red-500 hover:text-red-600'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center border-b pb-2'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Instructions
            </h2>
            <button
              type='button'
              onClick={addInstruction}
              className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200'
            >
              + Add Step
            </button>
          </div>
          <div className='space-y-4'>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className='flex gap-4'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  <textarea
                    value={instruction}
                    onChange={(e) => {
                      const newInstructions = [...recipe.instructions];
                      newInstructions[index] = e.target.value;
                      setRecipe({ ...recipe, instructions: newInstructions });
                    }}
                    className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder={`Step ${index + 1}`}
                    rows={3}
                    required
                  />
                </div>
                {recipe.instructions.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeInstruction(index)}
                    className='text-red-500 hover:text-red-600'
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details Section */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900 border-b pb-2'>
            Additional Details
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cooking Time (minutes)
              </label>
              <input
                type='number'
                value={recipe.cookingTime}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    cookingTime: parseInt(e.target.value),
                  })
                }
                min='1'
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Servings
              </label>
              <input
                type='number'
                value={recipe.servings}
                onChange={(e) =>
                  setRecipe({ ...recipe, servings: parseInt(e.target.value) })
                }
                min='1'
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-4'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            {isEditing ? 'Save Changes' : 'Create Recipe'}
          </button>
        </div>
      </div>
    </form>
  );
}
