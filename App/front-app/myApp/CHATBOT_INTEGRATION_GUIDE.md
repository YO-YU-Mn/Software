# دليل ربط ChatBot مع التطبيق

## الملفات المضافة:

### Backend:
1. **Backend/routes/chatbotRoutes.js**: يحتوي على الـ API endpoint للتواصل مع Google Gemini

### Frontend:
1. **App/front-app/myApp/components/ChatBot/ChatScreen.jsx**: واجهة الشات على الموبايل

## خطوات الربط:

### 1️⃣ تثبيت المكتبات المطلوبة:

#### في Backend:
```bash
cd Backend
npm install @google/generative-ai dotenv
```

#### في Frontend:
```bash
cd App/front-app/myApp
npm install react-native-gifted-chat
```

### 2️⃣ إعداد متغيرات البيئة:

#### Backend (.env):
```
MONGO_URI=mongodb://localhost:27017/university_app
GEMINI_API_KEY=sk-xxx-xxxxxxx  # احصل عليه من console.cloud.google.com
PORT=9000
```

#### Frontend (.env):
```
EXPO_PUBLIC_API_URL=http://192.168.1.X:9000
# استبدل 192.168.1.X بـ IP عنوان جهازك الحقيقي
```

### 3️⃣ إنشاء الأدلة الناقصة:

```bash
# إنشاء دليل ChatBot إذا كان غير موجود
mkdir -p App/front-app/myApp/components/ChatBot
```

### 4️⃣ ربط ChatScreen مع التطبيق:

في ملف التطبيق الرئيسي (مثلاً app.js أو routing file):

```jsx
import ChatScreen from './components/ChatBot/ChatScreen';

// أضف ChatScreen كـ tab أو screen في التطبيق
```

### 5️⃣ التأكد من أن Backend يستخدم Port 9000:

تحقق من `Backend/server.js`:
```javascript
app.listen(9000, () => {
    console.log('Server running on port 9000');
});
```

## كيفية الحصول على Gemini API Key:

1. اذهب إلى https://console.cloud.google.com/
2. أنشئ مشروع جديد
3. فعّل Google Generative AI API
4. اذهب إلى Credentials وأنشئ API Key
5. انسخ الـ API Key في .env file

## اختبار التطبيق:

### تشغيل Backend:
```bash
cd Backend
npm run dev  # أو npm start
```

### تشغيل Frontend:
```bash
cd App/front-app/myApp
npm start  # أو expo start
# اختر Android, iOS, أو Web
```

## الميزات المضافة:

✅ Chat واجهة جميلة
✅ دعم اللغة العربية
✅ دعم Multiple Messages
✅ Loading Indicator
✅ Error Handling
✅ Integration مع Google Gemini AI

## الملاحظات المهمة:

- تأكد من أن جميع الخدمات تعمل على نفس الـ Network
- استخدم IP address بدلاً من localhost في Frontend
- في الإنتاج، استخدم HTTPS و اختبر Security جيداً
- لا تنسى إضافة .env في .gitignore

## حل المشاكل الشائعة:

### خطأ "Cannot connect to server":
- تأكد من أن Backend يعمل على port 9000
- تحقق من الـ IP address في .env
- تأكد من أن جهازك و الموبايل على نفس الـ WiFi Network

### خطأ "GEMINI_API_KEY is not defined":
- تأكد من وجود .env file في Backend
- تحقق من أن require('dotenv').config() موجود في server.js

### الرسائل لا تظهر:
- تأكد من أن student schema فيه _id field
- تحقق من MongoDB connection
