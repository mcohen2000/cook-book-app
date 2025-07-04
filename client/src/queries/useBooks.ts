import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import type { Book, BookModalItem } from '../types/book';

export const useCookbooks = (userId?: string) => {
  return useQuery<Book[]>({
    queryKey: ['cookbooks', userId],
    queryFn: () => bookService.getCookbooks(userId),
  });
};

export const useUserCookbooks = () => {
  return useQuery<BookModalItem[]>({
    queryKey: ['user-cookbooks'],
    queryFn: bookService.getUserCookbooks,
  });
};

export const useCookbook = (id: string) => {
  return useQuery<Book>({
    queryKey: ['cookbook', id],
    queryFn: () => bookService.getCookbook(id),
    enabled: !!id,
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

export const useDeleteCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookService.deleteCookbook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      queryClient.invalidateQueries({ queryKey: ['user-cookbooks'] });
    },
  });
};
