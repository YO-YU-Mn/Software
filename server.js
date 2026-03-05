const express = require('express');

const mongoose = require('mongoose');

// اختصار لـ (Cross-Origin Resource Sharing). 
// دي "تصريح أمني"؛ من غيرها المتصفح أو الموبايل هيرفض يكلم السيرفر بتاعك لأسباب أمنية.
const cors = require('cors'); // مهم جداً عشان الموبايل والويب يعرفوا يكلموا السيرفر

require('dotenv').config(); // لو بتستخدم متغيرات بيئة

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

app.use('/api', authRoute);

app.get('/', (req , res) => {
    res.send('Server is running and MongoDB connection is in progress...');
});

// الربط بالداتا بيز والتشغيل
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
})
.catch((error) => {
    console.log('Database Connection Error: ' + error);
});
