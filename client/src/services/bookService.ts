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
    cookbookIds: string[],
    recipeId: string
  ): Promise<Book[]> => {
    const response = await fetch(`${API_URL}/books/add-recipe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId, cookbookIds }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add recipe to cookbook(s)');
    return response.json();
  },
};
