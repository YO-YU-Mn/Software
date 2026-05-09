import { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Android hardware back: go to login (/) with replace semantics via clearing to home route.
 * Keeps users from backing into dashboard after logout (stack is / only).
 */
export function useProtectedBackToLogin() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/');
        return true;
      });
      return () => sub.remove();
    }, [router])
  );
}
