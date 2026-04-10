const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/courses');
const auth = require('../middleware/auth');

// ===== Academic Advisor Chatbot =====
// الطالب بيبعت سؤال، السيرفر يجيب بياناته من الداتا بيز
// ويبعتها مع السؤال لـ Claude API عشان يرد بذكاء

router.post('/ask', auth, async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 1. جيب بيانات الطالب الكاملة من الداتا بيز
        const student = await Student.findOne({ code: req.user.code });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // 2. جيب المواد المتاحة للطالب (حسب تخصصه وليفله وسيمستره)
        const availableCourses = await Course.find({
            department: student.specialization,
            level: student.level,
            semester: student.semester
        });

        // 3. جيب تفاصيل المواد الحالية والمنتهية
        const currentCoursesDetails = await Course.find({
            course_id: { $in: student.currentCourses }
        });

        const completedCoursesDetails = await Course.find({
            course_id: { $in: student.completedCourses }
        });

        // 4. احسب المتطلبات السابقة لكل مادة متاحة
        const coursesWithStatus = availableCourses.map(course => {
            const prerequisites = course.prerequisites || [];
            const prerequisitesMet = prerequisites.every(pre =>
                student.completedCourses.includes(pre)
            );
            const isRegistered = student.currentCourses.includes(course.course_id);
            const hasCapacity = course.enrolledStudents < course.capacity;
            const missingPrereqs = prerequisites.filter(pre =>
                !student.completedCourses.includes(pre)
            );

            return {
                course_id: course.course_id,
                title: course.title,
                credits: course.credits,
                instructor: course.instructor,
                schedule: course.schedule,
                prerequisites,
                missingPrereqs,
                prerequisitesMet,
                isRegistered,
                hasCapacity,
                canRegister: !isRegistered && prerequisitesMet && hasCapacity,
                enrolledStudents: course.enrolledStudents,
                capacity: course.capacity
            };
        });

        // 5. ابني الـ System Prompt مع كل بيانات الطالب
        const systemPrompt = `
أنت مستشار أكاديمي ذكي لنظام تسجيل المواد الجامعية.
اسمك "المستشار الأكاديمي". تتحدث باللغة العربية دائماً وبأسلوب ودود ومهني.

═══════════════════════════════
📋 بيانات الطالب الحالي:
═══════════════════════════════
• الاسم: ${student.name}
• الكود: ${student.code}
• التخصص: ${student.specialization}
• المستوى (السنة): ${student.level}
• الفصل الدراسي: ${student.semester}
• المعدل التراكمي (GPA): ${student.GPA}
• سنة التخرج المتوقعة: ${student.gradute_year}

═══════════════════════════════
✅ المواد المكتملة (${completedCoursesDetails.length} مادة):
═══════════════════════════════
${completedCoursesDetails.length > 0
    ? completedCoursesDetails.map(c => `• ${c.course_id}: ${c.title} (${c.credits} ساعة)`).join('\n')
    : '• لا توجد مواد مكتملة بعد'}

═══════════════════════════════
📚 المواد المسجلة حالياً (${currentCoursesDetails.length} مادة):
═══════════════════════════════
${currentCoursesDetails.length > 0
    ? currentCoursesDetails.map(c => `• ${c.course_id}: ${c.title} (${c.credits} ساعة) - د. ${c.instructor}`).join('\n')
    : '• لا توجد مواد مسجلة حالياً'}

═══════════════════════════════
🔍 المواد المتاحة في الفصل الحالي وحالة تسجيلها:
═══════════════════════════════
${coursesWithStatus.length > 0
    ? coursesWithStatus.map(c => `
• ${c.course_id}: ${c.title} (${c.credits} ساعة)
  - المدرس: ${c.instructor}
  - الحالة: ${c.isRegistered ? '✅ مسجلة' : c.canRegister ? '🟢 يمكن التسجيل' : '🔴 لا يمكن التسجيل'}
  - المتطلبات السابقة: ${c.prerequisites.length === 0 ? 'لا يوجد' : c.prerequisites.join(', ')}
  ${c.missingPrereqs.length > 0 ? `- ⚠️ المتطلبات الناقصة: ${c.missingPrereqs.join(', ')}` : ''}
  - الطاقة: ${c.enrolledStudents}/${c.capacity} طالب ${!c.hasCapacity ? '(ممتلئة)' : ''}
  - المواعيد: ${c.schedule && c.schedule.length > 0 ? c.schedule.map(s => `${s.day} ${s.time} - ${s.location}`).join(' | ') : 'غير محدد'}
`).join('\n')
    : '• لا توجد مواد متاحة في الفصل الحالي'}

═══════════════════════════════
📌 تعليمات مهمة:
═══════════════════════════════
- أجب على أسئلة الطالب بناءً على البيانات أعلاه فقط
- إذا سأل عن مادة معينة، اشرح له هل يمكنه تسجيلها أم لا وليه
- إذا سأل عن جدوله، اعرض له المواد المسجلة حالياً بشكل منظم
- إذا سأل عن متطلبات مادة، وضح له المواد اللازمة وهل أتمها أم لا
- كن محدداً وواضحاً، لا تخترع معلومات غير موجودة في البيانات
- إذا طلب الطالب تسجيل مادة، قل له إنه يقدر يسجلها من خلال صفحة التسجيل في الموقع
        `.trim();

        // 6. ابعت الطلب لـ Claude API
        const messagesForAPI = [
            ...history.map(h => ({
                role: h.role,
                content: h.content
            })),
            { role: 'user', content: message }
        ];

        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey) {
            console.error('Advisor error: missing GROQ_API_KEY');
            return res.status(500).json({ error: 'Missing GROQ_API_KEY in server environment.' });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                max_tokens: 1024,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messagesForAPI
                ]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Advisor API Error:', errText);
            return res.status(500).json({ error: 'Advisor API error', details: errText });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'عذراً، لم أستطع توليد رد.';

        res.json({
            success: true,
            reply,
            studentName: student.name
        });

    } catch (err) {
        console.error('Advisor error:', err);
        res.status(500).json({ error: err.message });
    }
});


// endpoint اختياري: جيب ملخص سريع للطالب
router.get('/summary', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ code: req.user.code });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const availableCourses = await Course.find({
            department: student.specialization,
            level: student.level,
            semester: student.semester
        });

        const canRegisterCount = availableCourses.filter(course => {
            const prereqsMet = course.prerequisites.every(p => student.completedCourses.includes(p));
            const notRegistered = !student.currentCourses.includes(course.course_id);
            const hasCapacity = course.enrolledStudents < course.capacity;
            return prereqsMet && notRegistered && hasCapacity;
        }).length;

        res.json({
            name: student.name,
            level: student.level,
            semester: student.semester,
            specialization: student.specialization,
            GPA: student.GPA,
            completedCount: student.completedCourses.length,
            currentCount: student.currentCourses.length,
            canRegisterCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
