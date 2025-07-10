import type { Book, BookModalItem } from '../types/book';

const API_URL = `${import.meta.env.VITE_REACT_APP_API_URL}/api`;

export const bookService = {
  getCookbooks: async ({
    userId,
    search,
  }: {
    userId?: string;
    search?: string;
  }): Promise<Book[]> => {
    let url = `${API_URL}/books`;
    const params = new URLSearchParams();
    if (userId) {
      params.append('userId', userId);
    }
    if (search) {
      params.append('search', search);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch cookbooks');
    return response.json();
  },

  getUserCookbooks: async (): Promise<BookModalItem[]> => {
    const response = await fetch(`${API_URL}/books/my-cookbooks`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch user cookbooks');
    return response.json();
  },

  getCookbook: async (id: string): Promise<Book> => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch cookbook');
    return response.json();
  },

  createCookbook: async (
    title: string,
    recipeId?: string,
    description?: string
  ): Promise<Book> => {
    const body: any = { title, description };
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

  deleteCookbook: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete cookbook');
  },

  updateCookbook: async (
    id: string,
    title: string,
    description?: string
  ): Promise<Book> => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update cookbook');
    return response.json();
  },
};
