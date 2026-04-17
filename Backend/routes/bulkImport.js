const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const auth = require('../middleware/auth');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

// تكوين multer لحفظ الملفات مؤقتاً
const upload = multer({ dest: 'uploads/' });
const allowedSpecializations = ['CS', 'Physics', 'Chem', 'Math', 'Bio'];

// دالة مساعدة للتحقق من صحة صف واحد
function validateStudentRow(row, rowIndex) {
  const errors = [];

  const requiredFields = ['code', 'password', 'name', 'specialization', 'level', 'semester'];
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push(`العمود "${field}" مطلوب`);
    }
  }
  if (errors.length > 0) return errors;
  
  if (!allowedSpecializations.includes(row.specialization)) {
    errors.push(`التخصص "${row.specialization}" غير مسموح. المسموح: ${allowedSpecializations.join(', ')}`);
  }
  
  const level = Number(row.level);
  if (isNaN(level) || level < 1 || level > 4) {
    errors.push(`المستوى "${row.level}" يجب أن يكون رقماً بين 1 و 4`);
  }
  
  const semester = Number(row.semester);
  if (isNaN(semester) || semester < 1 || semester > 2) {
    errors.push(`الترم "${row.semester}" يجب أن يكون 1 أو 2`);
  }
  
  return errors;
}

// رفع ملف إكسل وإضافة الطلاب
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    // التأكد من أن المستخدم أدمن
    //if (req.user.role !== 'admin') {
      //return res.status(403).json({ error: 'غير مصرح به، فقط الأدمن' });
    //}
    
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم رفع أي ملف' });
    }
    
    // قراءة الملف
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let rows = xlsx.utils.sheet_to_json(sheet);
    
    if (!rows || rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'الملف فارغ أو لا يحتوي على بيانات صالحة' });
    }
    
    // التأكد من وجود الأعمدة المطلوبة (بأسمائها)
    const requiredColumns = ['code', 'password', 'name', 'specialization', 'level', 'semester'];
    const firstRow = rows[0];
    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: `الملف لا يحتوي على الأعمدة المطلوبة: ${missingColumns.join(', ')}` 
      });
    }
    
    const results = {
      total: rows.length,
      successCount: 0,
      errors: []
    };
    
    const validStudents = [];
    const codesToCheck = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // لأن الصف الأول هو العناوين
      const validationErrors = validateStudentRow(row, rowNumber);
      
      if (validationErrors.length > 0) {
        results.errors.push({ row: rowNumber, errors: validationErrors });
        continue;
      }
      
      // تحويل البيانات إلى الشكل المطلوب للإدراج
      const studentData = {
        code: Number(row.code),
        password: Number(row.password),
        name: row.name.toString().trim(),
        email: row.email ? row.email.toString().trim() : '',
        phone: row.phone ? row.phone.toString().trim() : '',
        specialization: row.specialization,
        level: Number(row.level),
        semester: Number(row.semester),
        GPA: 0,
        gradute_year: new Date().getFullYear() + 4,
        university: 'Our University',
        completedCourses: [],
        currentCourses: []
      };
      
      validStudents.push({ data: studentData, row: rowNumber });
      codesToCheck.push(studentData.code);
      }
    
    // التحقق من الأكواد المكررة في قاعدة البيانات
    const existingStudents = await Student.find({ code: { $in: codesToCheck } });
    const existingCodesSet = new Set(existingStudents.map(s => s.code));
    
    const finalStudents = [];
    for (const item of validStudents) {
      if (existingCodesSet.has(item.data.code)) {
        results.errors.push({ row: item.row, errors: [`الكود ${item.data.code} موجود مسبقاً`] });
      } else {
        finalStudents.push(item.data);
      }
    }
    
    // إدراج الطلاب الصالحين دفعة واحدة
    if (finalStudents.length > 0) {
      try {
        await Student.insertMany(finalStudents, { ordered: false });
        results.successCount = finalStudents.length;
      } catch (insertError) {
        console.error(insertError);
        results.errors.push({ row: 0, errors: ['حدث خطأ أثناء إدراج الطلاب في قاعدة البيانات'] });
      }
    }
    
    // حذف الملف المؤقت
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