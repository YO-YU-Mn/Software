import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStudent from '../../hooks/useStudent';
import { API_BASE_URL } from '../../config';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const student = useStudent(); // الحصول على بيانات الطالب الحالي

  // رسالة الترحيب عند فتح الشاشة
  useEffect(() => {
    // الحصول على رقم الطالب من AsyncStorage
    const getStudentId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // يمكنك فك تشفير الـ token أو استخدام API endpoint للحصول على معلومات الطالب
          setStudentId(student?._id || null);
        }
      } catch (error) {
        console.error('Error getting student ID:', error);
      }
    };

    getStudentId();
    
    setMessages([
      {
        _id: 1,
        text: 'أهلاً بك في مساعد الجامعة الذكي. كيف يمكنني مساعدتك اليوم؟',
        createdAt: new Date(),
        user: { _id: 2, name: 'AI Bot' },
        isBot: true,
      },
    ]);
  }, [student]);

  // إرسال الرسالة
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || !studentId) {
      return;
    }

    // إضافة رسالة المستخدم فوراً
    const userMessage = {
      _id: Math.random().toString(),
      text: inputText,
      createdAt: new Date(),
      user: { _id: 1, name: 'أنت' },
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/ask`, {
        message: inputText,
        studentId: studentId,
      });

      if (response.data.success) {
        const botReply = {
          _id: Math.random().toString(),
          text: response.data.reply,
          createdAt: new Date(),
          user: { _id: 2, name: 'AI Bot' },
          isBot: true,
        };
        setMessages((prev) => [...prev, botReply]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        _id: Math.random().toString(),
        text: 'عذراً، حدثت مشكلة في الاتصال بالسيرفر. يرجى محاولة لاحقاً.',
        createdAt: new Date(),
        user: { _id: 2, name: 'AI Bot' },
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [inputText, studentId]);

  return (
    <View style={styles.container}>
      {/* قسم الرسائل */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {messages.map((msg) => (
          <View
            key={msg._id}
            style={[
              styles.messageRow,
              msg.isBot ? styles.botMessageRow : styles.userMessageRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.isBot
                  ? styles.botMessageBubble
                  : styles.userMessageBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.isBot ? styles.botText : styles.userText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </ScrollView>

      {/* قسم الإدخال */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="اكتب سؤالك هنا..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          editable={!loading}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>إرسال</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  botMessageBubble: {
    backgroundColor: '#e0e0e0',
  },
  userMessageBubble: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: '#333',
  },
  userText: {
    color: '#fff',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});