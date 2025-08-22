import type { Recipe } from '../types/recipe';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api`;

export const recipeService = {
  getRecipes: async <
    T = {
      recipes: Recipe[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }
  >({
    search = '',
    userId,
    page = 1,
    count,
  }: {
    search?: string;
    userId?: string;
    page?: number;
    count?: number;
  }): Promise<T> => {
    let url = `${API_URL}/recipes?`;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    if (count) params.append('count', count.toString());
    url += params.toString();
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json() as Promise<T>;
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

  ocrRecipe: async (
    text: string,
    provider: 'ollama' | 'openai' = 'ollama'
  ): Promise<Recipe> => {
    const response = await fetch(`${API_URL}/recipes/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, provider }),
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
