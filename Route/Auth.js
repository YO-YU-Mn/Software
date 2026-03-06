// وظيفته: ده "قلب الشغل" اللي هيكون فيه الـ 
// Route بتاع الـ /google-login والـ /traditional-login.
// ليه ؟ ده الي فيه ال 
// if و else والتحقق من ال Token الي باعته الموبيل

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../Schema/Student'); // تأكد من المسار
const Course = require('../Schema/Course');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// إعداد Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. تسجيل الدخول (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email: email.toLowerCase() });
        
        if (!student) return res.status(401).json({ message: 'الايميل غير مسجل' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ message: 'الباسورد غلط' });

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'SecretKey123', { expiresIn: '7d' });
        res.status(200).json({ message: 'تم دخول بنجاح', token, studentId: student._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// 2. توليد الجدول (AI Schedule)
router.get('/generate-schedule', async (req, res) => {
    try {
        const courses = await Course.find({}).limit(10);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `أنشئ جدول دراسي أسبوعي للمواد دي: ${courses.map(c => c.title).join(', ')}. الرد JSON فقط.`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        res.status(200).json(JSON.parse(jsonMatch[0]));
    } catch (error) {
        res.status(500).json({ message: 'AI Error', error: error.message });
    }
});

module.exports = router;