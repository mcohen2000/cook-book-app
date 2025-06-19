import { createContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthContext = createContext<{ user: any } | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
