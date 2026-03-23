const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/courses');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalCourses = await Course.countDocuments();
        res.json({ totalStudents, totalCourses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;