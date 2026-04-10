const express = require('express');
const router = express.Router();
// 1. استبدال مكتبة OpenAI بمكتبة Google
const { GoogleGenerativeAI } = require("@google/generative-ai"); 
const Student = require('../Schema/Student'); 
const Course = require('../Schema/Course'); 

// 2. ربط جيميناي بالمفتاح اللي في الـ .env بتاعك
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ask', async (req, res) => {
    const { message, studentId } = req.body; 

    try {
        // بنجيب بيانات الطالب والمواد اللي خلصها من الداتابيز
        const student = await Student.findById(studentId).populate('completedCourses');
        
        if (!student) {
            return res.status(404).json({ error: "الطالب غير موجود" });
        }

        // 3. بنجهز الموديل (استخدام gemini-1.5-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. بناء السياق (البرومبت) بنفس الطريقة اللي كنت عاملها
        const systemPrompt = `
            أنت مساعد أكاديمي ذكي لجامعة. 
            بيانات الطالب الحالي: ${student.name}. 
            المواد التي أجتازها: ${student.completedCourses.map(c => c.name).join(', ')}.
            لو سأل عن تسجيل مادة، راجع شروط المادة من قاعدة البيانات وجاوبه هل ينفع ولا لأ.
            سؤال الطالب الحالي هو: ${message}
        `;

        // 5. إرسال الطلب لجيميناي
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        
        // 6. الرد على الموبايل
        res.json({ reply: text });

    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "حصلت مشكلة في السيرفر" });
    }
});

module.exports = router;