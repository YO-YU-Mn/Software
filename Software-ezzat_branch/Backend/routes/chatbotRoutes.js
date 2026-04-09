const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Student = require('../models/student');
const Course = require('../models/courses');

// ربط جيميناي بالمفتاح اللي في الـ .env بتاعك
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /chatbot/ask
 * السؤال: الطالب يسأل سؤال والبوت يرد عليه
 */
router.post('/ask', async (req, res) => {
    const { message, studentId } = req.body;

    try {
        // بنجيب بيانات الطالب والمواد اللي خلصها من الداتابيز
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ error: "الطالب غير موجود" });
        }

        // بنجهز الموديل (استخدام gemini-1.5-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // بناء السياق (البرومبت)
        const systemPrompt = `
            أنت مساعد أكاديمي ذكي لجامعة.
            بيانات الطالب الحالي: ${student.name || 'طالب'}.
            رقم الطالب: ${student.code || 'غير محدد'}.
            لو سأل عن تسجيل مادة، أرشده للتنسيق مع الكلية.
            كن دودي وساعده في أسئلته الأكاديمية.
            سؤال الطالب الحالي هو: ${message}
        `;

        // إرسال الطلب لجيميناي
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        // الرد على الموبايل
        res.json({ success: true, reply: text });

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ success: false, error: "حصلت مشكلة في السيرفر" });
    }
});

module.exports = router;
