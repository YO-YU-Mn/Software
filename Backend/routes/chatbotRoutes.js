const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Student = require('../models/student');
const Course = require('../models/courses');
const Notification = require('../models/notification');
const News = require('../models/news');
const Settings = require('../models/Settings');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/ask', async (req, res) => {
    const { message, studentId } = req.body;

    try {
        // 1. بيانات الطالب
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "الطالب غير موجود" });

        // 2. المواد الحالية بتفاصيلها
        const currentCourses = await Course.find({
            course_id: { $in: student.currentCourses }
        });

        // 3. المواد اللي خلصها بتفاصيلها
        const completedCourses = await Course.find({
            course_id: { $in: student.completedCourses }
        });

        // 4. كل المواد المتاحة في مستوى الطالب
        const availableCourses = await Course.find({
            level: student.level,
            course_id: { $nin: [...student.completedCourses, ...student.currentCourses] }
        });

        // 5. إعدادات النظام (التسجيل مفتوح؟)
        const settings = await Settings.findOne().sort({ updatedAt: -1 });

        // 6. الإشعارات الخاصة بالطالب أو للكل
        const notifications = await Notification.find({
            $or: [
                { target: 'all' },
                { target: `level${student.level}` },
                { studentCode: String(student.code) }
            ]
        }).sort({ createdAt: -1 }).limit(5);

        // 7. آخر الأخبار
        const news = await News.find({ published: true })
            .sort({ createdAt: -1 }).limit(5);

        // === بناء السياق ===

        const currentCoursesText = currentCourses.map(c => {
            const scheduleText = c.schedule?.map(s =>
                `${s.day} ${s.time} - ${s.location}`
            ).join(' | ') || 'غير محدد';
            return `• ${c.title} (${c.course_id}) | ${c.credits} ساعة | د. ${c.instructor} | ${scheduleText}`;
        }).join('\n') || 'لا يوجد';

        const completedCoursesText = completedCourses.map(c =>
            `• ${c.title} (${c.course_id}) | ${c.credits} ساعة`
        ).join('\n') || 'لا يوجد';

        const availableCoursesText = availableCourses.map(c => {
            const prereqsMet = c.prerequisites.every(p => student.completedCourses.includes(p));
            const status = prereqsMet ? '✅ مؤهل' : '❌ متطلبات ناقصة';
            const missing = !prereqsMet
                ? ` (ناقص: ${c.prerequisites.filter(p => !student.completedCourses.includes(p)).join(', ')})`
                : '';
            return `• ${c.title} (${c.course_id}) | ${c.credits} ساعة | د. ${c.instructor} | ${status}${missing}`;
        }).join('\n') || 'لا يوجد مواد متاحة';

        const notificationsText = notifications.map(n =>
            `• [${n.date}] ${n.title}: ${n.description}`
        ).join('\n') || 'لا يوجد';

        const newsText = news.map(n =>
            `• [${n.date}] ${n.title}: ${n.description}`
        ).join('\n') || 'لا يوجد';

        const registrationStatus = settings?.registrationOpen
            ? `✅ مفتوح - الترم الحالي: ${settings.currentSemester} - الحد الأقصى: ${settings.maxCreditHours} ساعة`
            : `❌ مغلق حالياً`;

        // حساب الساعات المسجلة
        const currentCredits = currentCourses.reduce((sum, c) => sum + (c.credits || 0), 0);
        const completedCredits = completedCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

        const systemPrompt = `أنت المرشد الأكاديمي الذكي للجامعة. أجب على أسئلة الطالب بدقة بناءً على بياناته فقط.

═══════════════════════════════
👤 بيانات الطالب:
• الاسم: ${student.name}
• الكود: ${student.code}
• التخصص: ${student.specialization}
• الجامعة: ${student.university}
• المستوى: ${student.level} | الفصل: ${student.semester}
• GPA: ${student.GPA}
• سنة التخرج المتوقعة: ${student.gradute_year}
• الساعات الحالية المسجلة: ${currentCredits} ساعة
• الساعات المكتملة: ${completedCredits} ساعة
• الإيميل: ${student.email || 'غير محدد'} | التليفون: ${student.phone || 'غير محدد'}
═══════════════════════════════
📚 المواد الحالية (الترم ده):
${currentCoursesText}
═══════════════════════════════
✅ المواد المكتملة:
${completedCoursesText}
═══════════════════════════════
🔓 مواد متاحة للتسجيل (المستوى ${student.level}):
${availableCoursesText}
═══════════════════════════════
⚙️ حالة التسجيل: ${registrationStatus}
═══════════════════════════════
🔔 آخر الإشعارات:
${notificationsText}
═══════════════════════════════
📰 آخر الأخبار:
${newsText}
═══════════════════════════════

تعليمات:
- أجب بناءً على البيانات الموجودة فقط ولا تخترع معلومات
- لو سأل عن جدوله: اعرض المواد مع المواعيد والقاعات والدكاترة
- لو سأل عن التسجيل: أخبره بالحالة والمواد المؤهل لها فقط
- لو سأل عن GPA أو مستواه: أخبره بالأرقام الموجودة
- لو سأل عن إشعار أو خبر: اعرض المعلومات المتاحة
- اكتب بالعربي دائماً وكن واضحاً وموجزاً`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 1024,
        });

        const text = completion.choices[0].message.content;
        console.log("الرد:", text);
        res.json({ success: true, reply: text });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ success: false, error: "حصلت مشكلة في السيرفر" });
    }
});

module.exports = router;
