const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const auth = require('../middleware/auth');

router.get('/all', auth, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// جيب بيانات الطالب by token
router.get('/profile', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ code: req.user.code });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// جيب طلاب تخصص معين في سنة معينة
router.get('/department/:dep/level/:level', async (req, res) => {
    try{
        const students = await Student.find({
        specialization: req.params.dep,
        level: Number(req.params.level)
    });
     res.json(students);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
});


// جيب كل طلاب تخصص معين
// مثال: /student/department/CS
router.get('/department/:dep', async (req, res) => {
   try{
     const students = await Student.find({ specialization: req.params.dep });
    res.json(students);
   }catch(err){
    res.status(500).json({ error: err.message });
   }
});

// ضيف طالب جديد (الأدمن) in any department at any level i want this
router.post('/addstudent', async (req, res) => {
    try {
        const existing = await Student.findOne({ code: req.body.code });
        if (existing) {
            return res.json({ success: false, message: 'Student exists' });
        }
        const student = new Student(req.body);
        await student.save();

        res.json({ success: true, student , message:'done'});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// عدّل بيانات طالب (الأدمن)
router.put('/updatestudent/:code',  async (req, res) => {
    try {
        const updated = await Student.findOneAndUpdate(
            { code: req.params.code },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.json({ success: false });
        }
        res.json({ success: true, student: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// احذف طالب (الأدمن)
router.delete('/delete/:code',  async (req, res) => {
    try {
        await Student.findOneAndDelete({ code: req.params.code });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// الأدمن يجيب طالب معين عن طريق الكود
router.get('/student/:code', async (req, res) => {
    const student = await Student.findOne({ code: req.params.code });
    if(!student) return res.json({ success: false, message: 'Student not found!' });
    res.json(student);
});


// حذف مجموعة طلاب (دفعة واحدة)
router.delete('/bulk-delete', auth, async (req, res) => {
  try {
    // التحقق من أن المستخدم أدمن (اختياري)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { codes } = req.body; // مصفوفة من الأكواد
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ success: false, message: 'No codes provided' });
    }

    const result = await Student.deleteMany({ code: { $in: codes } });
    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `تم حذف ${result.deletedCount} طالب بنجاح`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;