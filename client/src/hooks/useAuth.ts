import { useQuery } from '@tanstack/react-query';
import { checkAuth } from '../services/userService';

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuth,
  });
  return { user, isLoading };
}
