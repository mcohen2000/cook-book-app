import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import type { Recipe } from '../types/recipe';

export const useRecipes = (search: string = '') => {
  return useQuery({
    queryKey: ['recipes', search],
    queryFn: () => recipeService.getRecipes(search),
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
    mutationFn: recipeService.ocrRecipe,
  });
};
