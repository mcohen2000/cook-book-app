import { useState } from 'react';

interface Ingredient {
  name: string;
  amount: string;
}

interface RecipeFormProps {
  onSubmit: (recipe: any) => void;
}

export default function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '' }] as Ingredient[],
    instructions: [''],
    cookingTime: 0,
    servings: 1,
  });

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { name: '', amount: '' }],
    });
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(recipe);
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
              onClick={() =>
                setRecipe({
                  ...recipe,
                  instructions: [...recipe.instructions, ''],
                })
              }
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
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                min='1'
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
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                min='1'
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='pt-4'>
          <button
            type='submit'
            className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Create Recipe
          </button>
        </div>
      </div>
    </form>
  );
}
