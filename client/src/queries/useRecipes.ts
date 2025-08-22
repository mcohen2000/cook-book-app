import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import type { Recipe } from '../types/recipe';

export const useRecipes = (options: {
  search?: string;
  userId?: string;
  page?: number;
  count?: number;
}) => {
  const { search = '', userId, page = 1, count = 12 } = options || {};
  return useQuery({
    queryKey: ['recipes', { search, userId, page, count }],
    queryFn: () => recipeService.getRecipes({ search, userId, page, count }),
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getRecipeById(id),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recipeService.createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, recipe }: { id: string; recipe: Omit<Recipe, '_id'> }) =>
      recipeService.updateRecipe(id, recipe),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recipeService.deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useOcrRecipe = () => {
  return useMutation({
    mutationFn: ({
      text,
      provider,
    }: {
      text: string;
      provider: 'ollama' | 'openai';
    }) => recipeService.ocrRecipe(text, provider),
  });
};
