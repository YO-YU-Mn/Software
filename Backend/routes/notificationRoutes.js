const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const SECRET = 'university_secret_key';
const PushToken = require('../models/pushToken');

// ========== الوظائف القديمة (محفوظة كما هي) ==========

// جيب إشعارات الطالب (للويب) - تشمل العامة والمستوى والخاصة
router.get('/get', async (req, res) => {
    try {
        const { code } = jwt.verify(req.headers.authorization, SECRET);
        const student = await Student.findOne({ code });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const level = student.level;

        const notifications = await Notification.find({
            $or: [
                { target: 'all' },
                { target: `level${level}` },
                { target: 'specific', studentCode: code }
            ]
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ضيف إشعار لطالب معين (الأدمن) - القديم
router.post('/add/:code', async (req, res) => {
    const student = await Student.findOne({ code: req.params.code });
    if(!student) {
        return res.json({ success: false, message: 'Student not found!' });
    }
    const { title, description, date } = req.body;
    const notification = new Notification({
        studentCode: req.params.code,
        title,
        description,
        date,
        target: 'specific' // نضيف target افتراضي
    });
    await notification.save();
    res.json({ success: true, message: 'Notification sent!' });
});

// عدّل إشعار
router.put('/update/:id', async (req, res) => {
  const { title, description, date, target, studentCode } = req.body;
  await Notification.findByIdAndUpdate(req.params.id, { title, description, date, target, studentCode });
  res.json({ success: true, message: 'Notification updated!' });
});

// احذف إشعار واحد
router.delete('/delete/:id', async (req, res) => {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted!' });
});

// احذف كل إشعارات طالب
router.delete('/deleteall/:code', async (req, res) => {
    await Notification.deleteMany({ studentCode: req.params.code });
    res.json({ success: true, message: 'All notifications deleted for that student' });
});

// ========== الوظائف الجديدة (للوحة تحكم الأدمن) ==========
// GET جميع الإشعارات (للأدمن)
router.get('/all', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST إشعار جديد (يدعم target)
router.post('/add', async (req, res) => {
    try {
        const { target, studentCode } = req.body;
        if (target === 'specific' && !studentCode) {
            return res.status(400).json({ error: 'Student code required' });
        }
        const notification = new Notification(req.body);
        await notification.save();
        const tokens = await PushToken.find({});

for (const t of tokens) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: t.expoPushToken,
      title: req.body.title,
      body: req.body.description,
      sound: 'default',
    }),
  });
}
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE إشعار (للأدمن) - نفس الوظيفة القديمة لكن هنا بالـ id
router.delete('/admin/:id', async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/save-token', async (req, res) => {
  try {
    const { studentCode, expoPushToken } = req.body;

    await PushToken.findOneAndUpdate(
      { studentCode },
      { expoPushToken },
      { upsert: true }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;