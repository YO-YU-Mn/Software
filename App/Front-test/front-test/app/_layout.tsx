import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import QueryProvider from '../providers/QueryProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider> 
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
      </QueryProvider>
    </AuthProvider>
  );
}