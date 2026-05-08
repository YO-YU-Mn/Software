import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  router,
} from 'expo-router';

type AuthType = {

  token: string | null;

  login: (
    token: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  loading: boolean;
};

const AuthContext =
  createContext<AuthType>(
    {} as AuthType
  );

export function AuthProvider({
  children,
}: any) {

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadToken();

  }, []);

  async function loadToken() {

    const saved =
      await AsyncStorage.getItem('token');

    setToken(saved);

    setLoading(false);
  }

  async function login(
    newToken: string
  ) {

    await AsyncStorage.setItem(
      'token',
      newToken
    );

    setToken(newToken);

    router.replace('/(tabs)/profile');
  }

  async function logout() {

    await AsyncStorage.removeItem(
      'token'
    );

    setToken(null);

    router.replace('/login');
  }

  return (

    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  return useContext(AuthContext);
}