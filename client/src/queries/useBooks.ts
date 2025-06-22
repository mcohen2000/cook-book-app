import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import type { Book } from '../types/book';

export const useCookbooks = () => {
  return useQuery<Book[]>({
    queryKey: ['cookbooks'],
    queryFn: bookService.getCookbooks,
  });
};

export const useUserCookbooks = () => {
  return useQuery<Book[]>({
    queryKey: ['user-cookbooks'],
    queryFn: bookService.getUserCookbooks,
  });
};

export const useCreateCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, recipeId }: { title: string; recipeId?: string }) =>
      bookService.createCookbook(title, recipeId),
    onSuccess: (newCookbook) => {
      // Invalidate and refetch both cookbooks and user cookbooks
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      queryClient.invalidateQueries({ queryKey: ['user-cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['user-cookbooks'] });
      return newCookbook;
    },
  });
};

export const useAddRecipeToCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cookbookId,
      recipeId,
    }: {
      cookbookId: string;
      recipeId: string;
    }) => bookService.addRecipeToCookbook(cookbookId, recipeId),
    onSuccess: () => {
      // Invalidate and refetch both cookbooks and user cookbooks
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      queryClient.invalidateQueries({ queryKey: ['user-cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['user-cookbooks'] });
    },
  });
};

export const useRemoveRecipeFromCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cookbookId,
      recipeId,
    }: {
      cookbookId: string;
      recipeId: string;
    }) => bookService.removeRecipeFromCookbook(cookbookId, recipeId),
    onSuccess: () => {
      // Invalidate and refetch both cookbooks and user cookbooks
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      queryClient.invalidateQueries({ queryKey: ['user-cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['cookbooks'] });
      queryClient.refetchQueries({ queryKey: ['user-cookbooks'] });
    },
  });
};
