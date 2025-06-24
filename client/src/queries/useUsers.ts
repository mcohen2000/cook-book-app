import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../services/userService';
import {
  likeRecipe,
  unlikeRecipe,
  likeCookbook,
  unlikeCookbook,
} from '../services/userService';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name }: { name: string }) => updateProfile({ name }),
    onSuccess: (updatedUser) => {
      // Update the auth context with the new user data
      queryClient.setQueryData(['auth'], { user: updatedUser });
      // Invalidate any queries that might depend on user data
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useLikeRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => likeRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useUnlikeRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => unlikeRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useLikeCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cookbookId: string) => likeCookbook(cookbookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useUnlikeCookbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cookbookId: string) => unlikeCookbook(cookbookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};
