import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../services/userService';

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
