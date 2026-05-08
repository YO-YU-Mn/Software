import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { COLORS, SHADOWS } from '../../constants/theme';
import API_URL from '../../config/api';

const CHATBOT_API = `${API_URL}/advisor/ask`;

export default function ChatbotScreen() {
  const { token } = useAuth();

  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      author: 'bot',
      text: 'أهلاً بك في المستشار الأكاديمي 👋',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      author: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMsg]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch(CHATBOT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token as string,
        },
        body: JSON.stringify({
          message: userMsg.text,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        author: 'bot',
        text: data.reply || 'لا يوجد رد',
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          author: 'bot',
          text: 'حصل خطأ',
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.author === 'bot'
          ? styles.botBubble
          : styles.userBubble,
      ]}
    >
      <Text
        style={
          item.author === 'bot'
            ? styles.botText
            : styles.userText
        }
      >
        {item.text}
      </Text>
    </View>
  );

 return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={110}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
   <FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  contentContainerStyle={styles.messagesContainer}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  onContentSizeChange={() =>
    flatListRef.current?.scrollToEnd({ animated: true })
  }
/>

      {loading && (
        <ActivityIndicator
          size="small"
          style={{ marginBottom: 10 }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالتك..."
          value={input}
          onChangeText={setInput}
          multiline
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Text style={styles.sendText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  messagesContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },

  botBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 5,
    ...SHADOWS.small,
  },

  userBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderTopRightRadius: 5,
  },

  botText: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 22,
  },

  userText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },

 inputContainer: {
  flexDirection: 'row',
  padding: 12,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderColor: '#e5e7eb',
  alignItems: 'flex-end',
   marginBottom: 15,
},

  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
textAlignVertical: 'top',
    maxHeight: 120,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: '#2563eb',
    marginLeft: 10,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});