import React, { useState, useCallback, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { GiftedChat } from 'react-native-gifted-chat';  // استدعاء المكتبة المسؤولة عن شكل الشات (الفقاعات، زر الإرسال، عرض الرسائل).
import axios from 'axios'; // مكتبة مشهورة بنستخدمها عشان نبعت "طلبات" (Requests) للسيرفر بتاعنا وناخد منه رد.
import { API_BASE_URL } from './config';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]); // هنا بنعمل "مخزن" اسمه messages ده اللي بيشيل كل الرسائل اللي دارت بين الطالب والبوت من أول ما فتح الشاشة.

  useEffect(() => {  // لكود اللي جواها بيتنفذ مرة واحدة بس أول ما الطالب يفتح شاشة الشات.
    setMessages([{  // بنحط أول رسالة في الشات يدوي، وهي رسالة الترحيب من البوت. لاحظ إن البوت واخد _id: 2 عشان نميزه عن الطالب.
        _id: 1,
        text: 'أهلاً بك في مساعد الجامعة الذكي. كيف يمكنني مساعدتك اليوم؟',
        createdAt: new Date(),
        user: { _id: 2, name: 'AI Bot' },
    }]);
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages)); // أول حاجة بنعملها إننا بناخد رسالة الطالب اللي كتبها ونعرضها فوراً في الشاشة فوق الرسائل القديمة.
    
    const userMessage = newMessages[0].text; // بنستخلص نص الرسالة اللي الطالب كتبها عشان نبعتها للسيرفر.

    try {
      const response = await axios.post(`http://${API_BASE_URL}:9000/api/chat/ask`, {  // هنا الموبايل بيكلم السيرفر بتاعك (اللي إحنا رفعنا كوده بره).
        studentId: "ID_OF_LOGGED_IN_USER" // هتاخده من الـ Auth بتاعك
      });

      const botReply = {
        _id: Math.random().toString(),
        text: response.data.reply,
        createdAt: new Date(),
        user: { _id: 2, name: 'AI Bot' },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botReply]));
    } catch (error) {
      console.error("Chat Error:", error);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{ _id: 1 }} // الـ ID بتاع الطالب الحالي
    />
  );
}