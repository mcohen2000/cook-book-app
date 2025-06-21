import type { Book } from '../types/book';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api`;

export const bookService = {
  getCookbooks: async (): Promise<Book[]> => {
    const response = await fetch(`${API_URL}/books`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch cookbooks');
    return response.json();
  },

  createCookbook: async (title: string, recipeId?: string): Promise<Book> => {
    const body: any = { title };
    if (recipeId) body.recipes = [recipeId];
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create cookbook');
    return response.json();
  },

  addRecipeToCookbook: async (
    cookbookId: string,
    recipeId: string
  ): Promise<Book> => {
    const response = await fetch(`${API_URL}/books/${cookbookId}/add-recipe`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add recipe to cookbook');
    return response.json();
  },

  removeRecipeFromCookbook: async (
    cookbookId: string,
    recipeId: string
  ): Promise<Book> => {
    const response = await fetch(
      `${API_URL}/books/${cookbookId}/remove-recipe`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
        credentials: 'include',
      }
    );
    if (!response.ok) throw new Error('Failed to remove recipe from cookbook');
    return response.json();
  },
};
