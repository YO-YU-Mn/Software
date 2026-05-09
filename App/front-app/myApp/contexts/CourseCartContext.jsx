import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'student_planned_courses_cart_v1';

const CourseCartContext = createContext(null);

function normalizeItem(raw) {
  if (!raw || !raw.id) return null;
  return {
    id: String(raw.id),
    name: raw.name ?? raw.title ?? '—',
    hours: typeof raw.hours === 'number' ? raw.hours : raw.credits ?? 0,
    instructor: raw.instructor ?? '',
    schedule: Array.isArray(raw.schedule) ? raw.schedule : [],
  };
}

export function CourseCartProvider({ children }) {
  const [items, setItems] = useState([]);
  /** When true next consume ships a frozen copy of the cart into registration merge. */
  const pendingMergeRef = useRef(null);

  const persist = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.map(normalizeItem).filter(Boolean));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback((raw) => {
    const n = normalizeItem(raw);
    if (!n) return;
    setItems((prev) => {
      if (prev.some((p) => p.id === n.id)) return prev;
      const next = [...prev, n];
      void persist(next);
      return next;
    });
  }, [persist]);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== String(id));
      void persist(next);
      return next;
    });
  }, [persist]);

  const clearCart = useCallback(() => {
    setItems([]);
    void persist([]);
  }, [persist]);

  const scheduleApplyCartToRegistration = useCallback(() => {
    pendingMergeRef.current = items.map((i) => ({ ...i }));
  }, [items]);

  const consumePlannedCoursesMerge = useCallback(() => {
    const snap = pendingMergeRef.current;
    pendingMergeRef.current = null;
    return snap;
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      scheduleApplyCartToRegistration,
      consumePlannedCoursesMerge,
    }),
    [
      items,
      addItem,
      removeItem,
      clearCart,
      scheduleApplyCartToRegistration,
      consumePlannedCoursesMerge,
    ]
  );

  return <CourseCartContext.Provider value={value}>{children}</CourseCartContext.Provider>;
}

export function useCourseCart() {
  const ctx = useContext(CourseCartContext);
  if (!ctx) throw new Error('useCourseCart must be used within CourseCartProvider');
  return ctx;
}
