import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Redirects to /login if session is missing. Aligns with AuthContext.
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (isLoading) return;
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [router, isAuthenticated, isLoading]),
  );

  return {
    authReady: !isLoading && isAuthenticated,
    checking: isLoading,
  };
}
