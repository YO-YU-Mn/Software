// وظيفته: ده "قلب الشغل" اللي هيكون فيه الـ 
// Route بتاع الـ /google-login والـ /traditional-login.
// ليه ؟ ده الي فيه ال 
// if و else والتحقق من ال Token الي باعته الموبيل

const express = require('express');

const router = express.Router();

const admin = require('../Config/Firebase');

const Student = require('../Schema/Student');

// ده المسار الحقيقي لتسجيل الدخول بجوجل
router.post('/google-login', async (req, res) => {
    const { idToken } = req.body;
});

module.exports = router;