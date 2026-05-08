import {
  ActivityIndicator,
  View,
} from 'react-native';

import {
  useEffect,
} from 'react';

import {
  router,
} from 'expo-router';

import {
  useAuth,
} from '../context/AuthContext';

export default function Index() {

  const {
    token,
    loading,
  } = useAuth();

  useEffect(() => {

    if (loading) return;

    if (token) {

      router.replace('/(tabs)/profile');

    } else {

      router.replace('/login');
    }

  }, [token, loading]);

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <ActivityIndicator size="large" />

    </View>
  );
}