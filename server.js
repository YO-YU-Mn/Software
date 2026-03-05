const express = require('express');

const mongoose = require('mongoose');

// اختصار لـ (Cross-Origin Resource Sharing). 
// دي "تصريح أمني"؛ من غيرها المتصفح أو الموبايل هيرفض يكلم السيرفر بتاعك لأسباب أمنية.
const cors = require('cors'); // مهم جداً عشان الموبايل والويب يعرفوا يكلموا السيرفر

require('dotenv').config(); // لو بتستخدم متغيرات بيئة

// استيراد الاعدادات 
// إنت هنا بتنادي على الوظيفة (Function) اللي إنت كتبتها في ملف DB.js والمسؤولة عن فتح الخط مع MongoDB Atlas.
const connectDB = require('./Config/DB.js');

// هنا بتنادي على ملف الإعدادات اللي فيه ملف الـ JSON، عشان السيرفر يعرف إنك "الآدمن" الرسمي لمشروع Firebase.
const firebaseAdmin = require('./Config/Firebase.js'); // ملف تهيئة فيربيز اللي هنعمله

// استيراد ال Route
// إنت بتقول للسيرفر: "لو حد سأل عن تسجيل الدخول، روح لملف Auth.js هو اللي فيه المنطق (Logic) كله".
const authRoute = require('./Route/Auth.js'); 

const app = express();

// Middlewares
// بنفعل تصريح الـ CORS اللي اتكلمنا عليه فوق عشان نسمح للموبايل يبعت لنا طلبات.
app.use(cors());

//السطر ده مهم جداً؛ بيخلي السيرفر "يفهم" البيانات اللي مبعوتة في شكل JSON (زي الإيميل والباسورد)،
//  من غيره السيرفر هيشوف البيانات دي طلاسم.
app.use(express.json()); // عشان السيرفر يفهم الـ JSON اللي باعتينه

// ربط الداتا بيز
connectDB();

// استخدام ال Route
//ركز هنا؛ إنت بتقول للسيرفر "أي طلب (Request) يبدأ بـ /api/auth حوّله فوراً لملف الـ authRoute".
app.use('/api/auth' , authRoute); // أي حاجة تخص الدخول هتبدأ بـ /api/auth

// هنا بتقول للسيرفر: "لو فيه بورت متحدد في الإعدادات استخدمه، لو مفيش اشتغل على بورت 5000".
const port = process.env.port || 5000

app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
});