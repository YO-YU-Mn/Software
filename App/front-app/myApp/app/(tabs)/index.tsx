import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentDashboard from './StudentDashboard';

export default function HomeScreen() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (!token) {
          router.replace('/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <StudentDashboard />;
}