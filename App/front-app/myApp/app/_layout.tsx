import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { FloatingAssistant } from '@/components/assistant/FloatingAssistant';
import { AssistantProvider } from '@/contexts/AssistantContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CourseCartProvider } from '../contexts/CourseCartContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function RootStackWithAssistant() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="usage-guide"
          options={{ title: 'دليل الاستخدام', headerShown: true, headerBackTitle: 'رجوع' }}
        />
        <Stack.Screen name="course/[courseId]" options={{ headerShown: true }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      {isAuthenticated && !isLoading ? <FloatingAssistant /> : null}
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <CourseCartProvider>
            <AssistantProvider>
              <RootStackWithAssistant />
            </AssistantProvider>
          </CourseCartProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
