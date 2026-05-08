const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const auth = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' });
const Course = require('../models/courses');
const Student = require('../models/student');

// قائمة الأقسام (departments) المسموحة – تطابق specializations أو حسب رغبتك
const allowedDepartments = ['CS', 'Physics', 'Chem', 'Math', 'Bio'];

// دالة التحقق من صحة صف كورس واحد
function validateCourseRow(row, rowIndex) {
  const errors = [];
  const requiredFields = ['course_id', 'title', 'credits', 'instructor', 'department', 'level', 'semester', 'capacity'];
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push(`العمود "${field}" مطلوب`);
    }
  }
  if (errors.length > 0) return errors;

  if (!allowedDepartments.includes(row.department)) {
    errors.push(`القسم "${row.department}" غير مسموح. المسموح: ${allowedDepartments.join(', ')}`);
  }

  const credits = Number(row.credits);
  if (isNaN(credits) || credits < 1 || credits > 6) {
    errors.push(`عدد الساعات "${row.credits}" يجب أن يكون رقماً بين 1 و 6`);
  }

  const level = Number(row.level);
  if (isNaN(level) || level < 1 || level > 4) {
    errors.push(`المستوى "${row.level}" يجب أن يكون 1-4`);
  }

  const semester = Number(row.semester);
  if (isNaN(semester) || semester < 1 || semester > 2) {
    errors.push(`الترم "${row.semester}" يجب أن يكون 1 أو 2`);
  }

  const capacity = Number(row.capacity);
  if (isNaN(capacity) || capacity < 1) {
    errors.push(`السعة "${row.capacity}" يجب أن تكون رقماً موجباً`);
  }

  // معالجة prerequisites (اختياري) – يمكن أن تكون نصاً مفصولاً بفواصل أو مصفوفة
  // سأفترض أنها تأتي كنص مفصول بفواصل، أو سلسلة فارغة
  // سنتعامل معها لاحقاً

  return errors;
}

// POST /courses/bulk-upload
router.post('/bulk-upload', auth, upload.single('file'), async (req, res) => {
  try {
    // اختياري: التحقق من أن المستخدم أدمن
    // if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم رفع أي ملف' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows || rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'الملف فارغ أو لا يحتوي على بيانات صالحة' });
    }

    // الأعمدة المطلوبة (يجب أن تكون موجودة كأسماء)
    const requiredColumns = ['course_id', 'title', 'credits', 'instructor', 'department', 'level', 'semester', 'capacity'];
    const firstRow = rows[0];
    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: `الأعمدة المطلوبة غير موجودة: ${missingColumns.join(', ')}` });
    }

    const results = {
      total: rows.length,
      successCount: 0,
      errors: []
    };

    const validCourses = [];
    const idsToCheck = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;
      const validationErrors = validateCourseRow(row, rowNumber);
      if (validationErrors.length > 0) {
        results.errors.push({ row: rowNumber, errors: validationErrors });
        continue;
      }

      // معالجة prerequisites – يمكن أن تكون مصفوفة أو نص مفصول بفواصل
      let prerequisites = [];
      if (row.prerequisites) {
        if (Array.isArray(row.prerequisites)) {
          prerequisites = row.prerequisites;
        } else if (typeof row.prerequisites === 'string') {
          prerequisites = row.prerequisites.split(',').map(s => s.trim()).filter(Boolean);
        }
      }

      // معالجة schedule – يمكن أن تكون نص JSON أو نتركها فارغة مؤقتاً
      let schedule = [];
      if (row.schedule) {
        try {
          if (typeof row.schedule === 'string') {
            schedule = JSON.parse(row.schedule);
          } else if (Array.isArray(row.schedule)) {
            schedule = row.schedule;
          }
        } catch (e) {
          // تجاهل، نتركها فارغة
        }
      }

      const courseData = {
        course_id: row.course_id.toString().trim(),
        title: row.title.toString().trim(),
        credits: Number(row.credits),
        instructor: row.instructor.toString().trim(),
        department: row.department,
        level: Number(row.level),
        semester: Number(row.semester),
        capacity: Number(row.capacity),
        enrolledStudents: 0, // دائماً صفر
        prerequisites: prerequisites,
        schedule: schedule
      };

      validCourses.push({ data: courseData, row: rowNumber });
      idsToCheck.push(courseData.course_id);
    }

    // التحقق من تكرار course_id في قاعدة البيانات
    const existingCourses = await Course.find({ course_id: { $in: idsToCheck } });
    const existingIdsSet = new Set(existingCourses.map(c => c.course_id));

    const finalCourses = [];
    for (const item of validCourses) {
      if (existingIdsSet.has(item.data.course_id)) {
        results.errors.push({ row: item.row, errors: [`معرف المادة ${item.data.course_id} موجود مسبقاً`] });
      } else {
        finalCourses.push(item.data);
      }
    }

    // إدراج الكورسات الصالحة دفعة واحدة
    if (finalCourses.length > 0) {
      try {
        await Course.insertMany(finalCourses, { ordered: false });
        results.successCount = finalCourses.length;
      } catch (insertError) {
        console.error(insertError);
        results.errors.push({ row: 0, errors: ['حدث خطأ أثناء إدراج الكورسات في قاعدة البيانات'] });
      }
    }

    fs.unlinkSync(req.file.path);
    res.json({
      success: true,
      total: results.total,
      successCount: results.successCount,
      errors: results.errors
    });

  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'حدث خطأ داخلي في الخادم' });
  }
});
module.exports = router;