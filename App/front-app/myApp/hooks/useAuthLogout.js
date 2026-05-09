import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAssistant } from '@/contexts/AssistantContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Full logout: AuthContext clears session, assistant UI resets, replace to login.
 */
export function useAuthLogout() {
  const router = useRouter();
  const { clearConversation } = useAssistant();
  const { logout } = useAuth();

  return useCallback(async () => {
    await logout();
    clearConversation();
    router.replace('/');
  }, [router, clearConversation, logout]);
}
