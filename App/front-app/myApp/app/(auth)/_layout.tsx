import { Stack } from 'expo-router';

/**
 * Auth flow only — no tab bar. Routes: /login
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
