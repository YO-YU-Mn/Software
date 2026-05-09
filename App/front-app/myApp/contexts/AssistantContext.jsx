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
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const STORAGE_KEY = '@academic_assistant_messages_v1';

const WELCOME = {
  _id: 'welcome',
  text: 'أهلاً بك في المساعد الأكاديمي. اسأل عن جدولك، معدلك، التسجيل، أو المواد المقترحة.',
  createdAt: new Date().toISOString(),
  isBot: true,
};

const AssistantContext = createContext(null);

export function AssistantProvider({ children }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [sending, setSending] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const sendInFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const trimmed = messages.slice(-50);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed)).catch(() => {});
  }, [messages, hydrated]);

  const clearConversation = useCallback(() => {
    setMessages([WELCOME]);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || sendInFlightRef.current) return;

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      const errMsg = {
        _id: `e-${Date.now()}`,
        text: 'يرجى تسجيل الدخول أولاً لاستخدام المساعد الأكاديمي.',
        createdAt: new Date().toISOString(),
        isBot: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      return;
    }

    const userMsg = {
      _id: `u-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
      isBot: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    sendInFlightRef.current = true;
    setSending(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chatbot/ask`,
        { message: trimmed },
        { headers: { Authorization: token }, timeout: 60000 }
      );
      if (response.data?.success && response.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `b-${Date.now()}`,
            text: response.data.reply,
            createdAt: new Date().toISOString(),
            isBot: true,
          },
        ]);
      } else {
        throw new Error(response.data?.error || 'empty');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          _id: `b-${Date.now()}`,
          text: 'تعذر الاتصال بالمساعد. تحقق من الشبكة أو حاول لاحقاً.',
          createdAt: new Date().toISOString(),
          isBot: true,
        },
      ]);
    } finally {
      sendInFlightRef.current = false;
      setSending(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      messages,
      sending,
      sendMessage,
      clearConversation,
      hydrated,
    }),
    [messages, sending, sendMessage, clearConversation, hydrated]
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return ctx;
}
