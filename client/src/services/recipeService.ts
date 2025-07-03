import type { Recipe } from '../types/recipe';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api`;

export const recipeService = {
  getRecipes: async (search: string = '', userId?: string) => {
    let url = `${API_URL}/recipes${
      search ? `?search=${encodeURIComponent(search)}` : ''
    }`;
    if (userId) {
      url += (search ? `&` : `?`) + `userId=${userId}`;
    }
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },

  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  },

  createRecipe: async (recipe: Omit<Recipe, '_id'>): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to create recipe');
    }
    return response.json();
  },

  updateRecipe: async (
    id: string,
    recipe: Omit<Recipe, '_id'>
  ): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to update recipe');
    }
    return response.json();
  },

  deleteRecipe: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
  },

  ocrRecipe: async (text: string): Promise<string> => {
    const response = await fetch(`${API_URL}/recipes/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to organize recipe with AI');
    }
    const data = await response.json();
    return data.result;
  },

  getUserRecipes: async (userId: string) => {
    const response = await fetch(`${API_URL}/recipes?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user recipes');
    }
    return response.json();
  },
};
