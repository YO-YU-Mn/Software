const express = require('express');
const router = express.Router();
const Course = require('../models/courses');
const Student = require('../models/student');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');

const auth = require('../middleware/auth');


router.get("/allcourses", async (req, res) => {
    try{
        const courses = await Course.find();
        res.json(courses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});


router.get("/course/:course_id", async (req, res) => {
   try{
     const course = await Course.findOne({ course_id: req.params.course_id });
     if(!course) {
        return res.json({ success: false, message: 'Course doesnot exists!' });
    }
    res.json(course);
   }catch(err){
     res.status(500).json({ error: err.message });
   }

});


const upload = multer({ dest: 'uploads/' });

router.post('/addCourse', async (req, res) => {
    try {
        const existing = await Course.findOne({ course_id: req.body.course_id });
        if(existing) {
            return res.json({ success: false, message: 'Course already exists!' });
        }
        const courseData = {
     ...req.body,
      prerequisites: Array.isArray(req.body.prerequisites) ? req.body.prerequisites : [],
      schedule: Array.isArray(req.body.schedule) ? req.body.schedule : []
    
};
        const course = new Course(courseData);
        await course.save();
        res.json({ success: true, message: 'Course added!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function parseScheduleField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  const trimmed = value.toString().trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    const items = trimmed.split(';').map(item => item.trim()).filter(Boolean);
    return items.map(item => {
      const parts = item.split('|').map(p => p.trim());
      return {
        day: parts[0] || '',
        time: parts[1] || '',
        location: parts[2] || ''
      };
    }).filter(entry => entry.day && entry.time);
  }
  return [];
}

router.post('/import', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم رفع أي ملف' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows || rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: 'الملف فارغ أو لا يحتوي على بيانات صالحة' });
    }

    const requiredColumns = ['course_id', 'title', 'credits', 'instructor', 'department', 'level', 'semester', 'capacity'];
    const firstRow = rows[0];
    const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: `الملف لا يحتوي على الأعمدة المطلوبة: ${missingColumns.join(', ')}` });
    }

    const results = { total: rows.length, successCount: 0, errors: [] };
    const validCourses = [];
    const courseIds = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;
      const errors = [];

      if (!row.course_id.toString().trim()) errors.push('course_id مطلوب');
      if (!row.title.toString().trim()) errors.push('title مطلوب');
      if (!row.instructor.toString().trim()) errors.push('instructor مطلوب');
      if (!row.department.toString().trim()) errors.push('department مطلوب');
      const credits = Number(row.credits);
      if (isNaN(credits) || credits <= 0) errors.push('credits يجب أن يكون رقماً أكبر من صفر');
      const level = Number(row.level);
      if (isNaN(level) || level < 1 || level > 4) errors.push('level يجب أن يكون رقماً بين 1 و 4');
      const semester = Number(row.semester);
      if (isNaN(semester) || semester < 1 || semester > 2) errors.push('semester يجب أن يكون 1 أو 2');
      const capacity = row.capacity === '' ? 30 : Number(row.capacity);
      if (isNaN(capacity) || capacity < 1) errors.push('capacity يجب أن يكون رقماً أكبر من صفر');

      if (errors.length > 0) {
        results.errors.push({ row: rowNumber, errors });
        continue;
      }

      validCourses.push({
        course_id: row.course_id.toString().trim(),
        title: row.title.toString().trim(),
        credits,
        instructor: row.instructor.toString().trim(),
        department: row.department.toString().trim(),
        level,
        semester,
        capacity,
        enrolledStudents: 0,
        prerequisites: parseArrayField(row.prerequisites),
        schedule: parseScheduleField(row.schedule)
      });
      courseIds.push(row.course_id.toString().trim());
    }

    const existing = await Course.find({ course_id: { $in: courseIds } });
    const existingSet = new Set(existing.map(c => c.course_id));
    const finalCourses = [];

    validCourses.forEach((course, index) => {
      if (existingSet.has(course.course_id)) {
        results.errors.push({ row: index + 2, errors: [`المادة ${course.course_id} موجودة مسبقاً`] });
      } else {
        finalCourses.push(course);
      }
    });

    if (finalCourses.length > 0) {
      try {
        await Course.insertMany(finalCourses, { ordered: false });
        results.successCount = finalCourses.length;
      } catch (insertErr) {
        console.error(insertErr);
        results.errors.push({ row: 0, errors: ['خطأ أثناء إدراج المواد في قاعدة البيانات'] });
      }
    }

    fs.unlinkSync(req.file.path);
    return res.json({ success: true, total: results.total, successCount: results.successCount, errors: results.errors });
  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, error: 'حدث خطأ داخلي في الخادم' });
  }
});

// عدّل مادة (الأدمن)
router.put('/updateCourse/:id', async (req, res) => {
    try{
        const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!updated) {
        return res.json({ success: false, message: 'Course not found!' });
    }
    res.json({ success: true, message: 'Course updated!', course: updated });
    }catch(err){
       res.status(500).json({ error: err.message }); 
    }
});

// احذف مادة (الأدمن)
router.delete('/deleteCourse/:id', async (req, res) => {
    try{
        await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted!' });
    }catch(err){
        res.status(500).json({ error: err.message });        
    }
});
/* normal crud for admin dashboard*/

// جيب مواد الطالب حسب تخصصه وليفله وسيمستره in web
router.get('/studentcourses',auth , async (req, res) => {
    try{
        const student = await Student.findOne({ code: req.user.code });
        const courses = await Course.find({
        department: student.specialization,
        level:      student.level,
        semester:   student.semester
    });
        const formattedCourses = courses.map(course => ({
            id: course.course_id,
            name: course.title,
            hours: course.credits,
            schedule: course.schedule,
            instructor:course.instructor
        }));

    res.json(formattedCourses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});


// مسح جميع المواد المسجلة للطالب
router.delete('/drop-all', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ code: req.user.code });
    const currentCourses = student.currentCourses;

   
    await Course.updateMany(
      { course_id: { $in: currentCourses } },
      { $inc: { enrolledStudents: -1 } }
    );

   
    student.currentCourses = [];
    await student.save();

    res.json({ success: true, message: 'تم حذف جميع المواد' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// الطالب يشيل مادة
router.delete('/drop', auth, async (req, res) => {
    const { course_id } = req.body;
    const student = await Student.findOne({ code: req.user.code });
    // تأكد إن الطالب مسجلها
    if(!student.currentCourses.includes(course_id)) {
        return res.json({ success: false, message: 'إنت مش مسجل المادة دي!' });
    }

    // شيلها من currentCourses بس
    student.currentCourses = student.currentCourses.filter(c => c !== course_id);
    await student.save();
     // نقص عدد الطلاب المسجلين في الكورس
    await Course.updateOne({ course_id }, { $inc: { enrolledStudents: -1 } });
    res.json({ success: true, message: 'تم حذف المادة!' });
});

// جيب المواد الحالية للطالب in web
router.get('/current', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ code: req.user.code });

        const courses = await Course.find({
            course_id: { $in: student.currentCourses }
        });

        res.json(courses);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// جيب المواد اللي الطالب خلصها in results 
router.get('/completed-courses',auth, async (req, res) => {
    try{
        const student = await Student.findOne({ code: req.user.code });

        const courses = await Course.find({
            course_id: { $in: student.completedCourses }
        });
        res.json(courses);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});


//get avaliable courses for that student
router.get("/available-courses", auth, async (req, res) => {
    try {
        const student = await Student.findOne({ code: req.user.code });
        const courses = await Course.find({
            department: student.specialization,
            level: student.level,
            semester: student.semester
        });

        const availableCourses = courses.map(course => {
            const prerequisites = course.prerequisites || [];
            let prerequisitesMet = true;
            for (let pre of prerequisites) {
                if (!student.completedCourses.includes(pre)) {
                    prerequisitesMet = false;
                    break;
                }
            }
            const hasCapacity = course.enrolledStudents < course.capacity;
            const isRegistered = student.currentCourses.includes(course.course_id); 
            const canRegister = !isRegistered && prerequisitesMet && hasCapacity;

            return {
                id: course.course_id,
                name: course.title,
                hours: course.credits,
                instructor: course.instructor,
                schedule: course.schedule,
                canRegister,
                isRegistered,   // إرسال هذه المعلومة للفرونت
                prerequisitesMet,
                hasCapacity
            };
        });

        res.json(availableCourses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//in web
router.post("/register-course", auth ,async (req, res) => {
    const { course_id } = req.body;
    const student = await Student.findOne({ code: req.user.code });
    const course = await Course.findOne({ course_id });
    if (!course)
        return res.json({ success: false, message: "Course not found" });
    if (student.currentCourses.includes(course_id))
        return res.json({ success: false, message: "Already registered" });
    // prerequisite
    for (let pre of course.prerequisites) {
        if (!student.completedCourses.includes(pre)) {
            return res.json({
                success: false,
                message: `You must pass ${pre}`
            });
        }
    }
    // capacity
    if (course.enrolledStudents >= course.capacity) {
        return res.json({
            success: false,
            message: "Course is full"
        });
    }
    student.currentCourses.push(course_id);
    course.enrolledStudents += 1;
    await student.save();
    await course.save();
    res.json({
        success: true,
        message: "Course registered"
    });
});


// تسجيل طالب محدد (بواسطة الأدمن) في مادة
router.post('/admin/register/:studentCode', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ code: req.params.studentCode });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const { course_id } = req.body;
        const course = await Course.findOne({ course_id });
        if (!course) return res.status(404).json({ error: 'Course not found' });

        if (student.currentCourses.includes(course_id)) {
            return res.status(400).json({ error: 'Already registered' });
        }

        // التحقق من المتطلبات السابقة
        for (let pre of course.prerequisites) {
            if (!student.completedCourses.includes(pre)) {
                return res.status(400).json({ error: `Prerequisite ${pre} not met` });
            }
        }

        if (course.enrolledStudents >= course.capacity) {
            return res.status(400).json({ error: 'Course full' });
        }

        student.currentCourses.push(course_id);
        course.enrolledStudents += 1;
        await student.save();
        await course.save();

        res.json({ success: true, message: 'Enrolled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// دالة مساعدة للتحقق من تعارض المواعيد
function checkScheduleConflict(newCourse, existingCourses) {
  if (!newCourse.schedule || newCourse.schedule.length === 0) return false;
  for (let existing of existingCourses) {
    if (!existing.schedule) continue;
    for (let s1 of newCourse.schedule) {
      for (let s2 of existing.schedule) {
        if (s1.day === s2.day && s1.time === s2.time) return true;
      }
    }
  }
  return false;
}

// تسجيل عدة مواد دفعة واحدة
router.post('/register-courses', auth, async (req, res) => {
  const { course_ids } = req.body; // مصفوفة من strings
  if (!Array.isArray(course_ids) || course_ids.length === 0) {
    return res.status(400).json({ success: false, message: 'No courses provided' });
  }

  const student = await Student.findOne({ code: req.user.code });
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const errors = [];
  const successfullyRegistered = [];

  // نجلب المواد الحالية كاملة للتحقق من التعارض
  const existingCourses = await Course.find({ course_id: { $in: student.currentCourses } });

  for (let course_id of course_ids) {
    // 1. هل المادة موجودة؟
    const course = await Course.findOne({ course_id });
    if (!course) {
      errors.push({ course_id, message: 'Course not found' });
      continue;
    }

    // 2. هل الطالب مسجلها بالفعل؟
    if (student.currentCourses.includes(course_id)) {
      errors.push({ course_id, message: 'Already registered' });
      continue;
    }

    // 3. تحقق prerequisites
    let prereqOk = true;
    for (let pre of course.prerequisites) {
      if (!student.completedCourses.includes(pre)) {
        prereqOk = false;
        break;
      }
    }
    if (!prereqOk) {
      errors.push({ course_id, message: 'Prerequisites not satisfied' });
      continue;
    }

    // 4. السعة متاحة؟
    if (course.enrolledStudents >= course.capacity) {
      errors.push({ course_id, message: 'Course is full' });
      continue;
    }

    // 5. تعارض مواعيد مع المواد الحالية والمواد التي سُجلت في نفس الطلب
    //    نجمع المواد الحالية + المواد التي نجحت حتى الآن
    const allCurrentCourses = [...existingCourses];
    // نضيف المواد التي تمت إضافتها في هذه الدفعة (ونجحت)
    const addedCourses = await Course.find({ course_id: { $in: successfullyRegistered } });
    allCurrentCourses.push(...addedCourses);

    if (checkScheduleConflict(course, allCurrentCourses)) {
      errors.push({ course_id, message: 'Schedule conflict' });
      continue;
    }

    // كل شيء تمام – نضيفها للقائمة الناجحة
    successfullyRegistered.push(course_id);
  }

  // بعد انتهاء الحلقة، لو في مواد نجحت، نحدّث قاعدة البيانات
  if (successfullyRegistered.length > 0) {
    // تحديث الطالب: إضافة المواد لـ currentCourses
    student.currentCourses.push(...successfullyRegistered);
    await student.save();

    // تحديث كل مادة: زيادة enrolledStudents بمقدار 1
    await Course.updateMany(
      { course_id: { $in: successfullyRegistered } },
      { $inc: { enrolledStudents: 1 } }
    );
  }

  res.json({
    success: true,
    registered: successfullyRegistered,
    errors: errors
  });
});


// تسجيل طالب محدد (بواسطة الأدمن) في مادة
router.post('/admin/register/:studentCode', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ code: req.params.studentCode });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { course_id } = req.body;
    const course = await Course.findOne({ course_id });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (student.currentCourses.includes(course_id)) {
      return res.status(400).json({ error: 'Already registered' });
    }

    // تحقق prerequisites
    for (let pre of course.prerequisites) {
      if (!student.completedCourses.includes(pre)) {
        return res.status(400).json({ error: `Prerequisite ${pre} not met` });
      }
    }

    if (course.enrolledStudents >= course.capacity) {
      return res.status(400).json({ error: 'Course full' });
    }

    student.currentCourses.push(course_id);
    course.enrolledStudents += 1;
    await student.save();
    await course.save();

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;