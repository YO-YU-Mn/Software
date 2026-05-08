const express = require('express');
const router = express.Router();
const Course = require('../models/courses');
const Student = require('../models/student');


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
    console.log(req.body);
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