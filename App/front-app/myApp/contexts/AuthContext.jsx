import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAuthSessionFromStorage } from '@/utils/authStorage';

const TOKEN_KEY = 'token';
const NAME_KEY = 'name';
const ROLE_KEY = 'role';

const AuthContext = createContext(undefined);
/**
 * Central session: boot from AsyncStorage, login bumps refreshKey for tab refetches,
 * logout clears storage and user.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const entries = await AsyncStorage.multiGet([TOKEN_KEY, NAME_KEY, ROLE_KEY]);
        const map = Object.fromEntries(entries);
        const token = map[TOKEN_KEY];
        if (!cancelled && token) {
          setUser({
            token,
            name: map[NAME_KEY] || '',
            role: map[ROLE_KEY] || 'student',
          });
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ token, name, role }) => {
    const t = token ?? '';
    const n = name ?? '';
    const r = role ?? 'student';
    await AsyncStorage.multiSet([
      [TOKEN_KEY, t],
      [NAME_KEY, n],
      [ROLE_KEY, r],
    ]);
    setUser({ token: t, name: n, role: r });
    setRefreshKey((k) => k + 1);
  }, []);

  const logout = useCallback(async () => {
    await clearAuthSessionFromStorage();
    setUser(null);
    setRefreshKey((k) => k + 1);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user?.token),
      refreshKey,
      login,
      logout,
    }),
    [user, isLoading, refreshKey, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// داخل ملف AuthContext.jsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // هذه الرسالة هي التي تظهر لك الآن لأن context قيمته undefined
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};
