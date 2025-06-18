import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';
import BackButton from './BackButton';

interface RecipeFormProps {
  onSubmit: (recipe: Omit<Recipe, '_id'>) => void;
  initialRecipe?: Recipe;
  isEditing?: boolean;
  title: string;
  subtitle: string;
  backTo: string;
  backText: string;
}

export default function RecipeForm({
  onSubmit,
  initialRecipe,
  isEditing = false,
  title,
  subtitle,
  backTo,
  backText,
}: RecipeFormProps) {
  const [formData, setFormData] = useState<Omit<Recipe, '_id'>>(() => {
    if (initialRecipe) {
      const { _id, createdAt, ...rest } = initialRecipe;
      return rest;
    }
    return {
      title: '',
      description: '',
      ingredients: [{ name: '', amount: '' }],
      instructions: [''],
      cookingTime: 0,
      servings: 1,
    };
  });

  useEffect(() => {
    if (initialRecipe) {
      setFormData(initialRecipe);
    }
  }, [initialRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateIngredient = (
    index: number,
    field: 'name' | 'amount',
    value: string
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <BackButton to={backTo} text={backText} />
      </div>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-lg p-8'
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
          <p className='mt-2 text-gray-600'>{subtitle}</p>
        </div>
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
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
              <h2 className='text-xl font-semibold text-gray-900'>
                Ingredients
              </h2>
              <button
                type='button'
                onClick={addIngredient}
                className='inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200'
              >
                + Add Ingredient
              </button>
            </div>
            <div className='space-y-3'>
              {formData.ingredients.map((ingredient, index) => (
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
                  {formData.ingredients.length > 1 && (
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
              {formData.instructions.map((instruction, index) => (
                <div key={index} className='flex gap-4'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium'>
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.instructions];
                        newInstructions[index] = e.target.value;
                        setFormData({
                          ...formData,
                          instructions: newInstructions,
                        });
                      }}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      placeholder={`Step ${index + 1}`}
                      rows={3}
                      required
                    />
                  </div>
                  {formData.instructions.length > 1 && (
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
                  value={formData.cookingTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                  value={formData.servings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servings: parseInt(e.target.value),
                    })
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
    </div>
  );
}
