// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');


router.post('/profile-picture', auth, upload.single('profilePic'), async (req, res) => {
  try {
  
    const imageUrl = req.file.path;
    const student = await Student.findOneAndUpdate(
      { code: req.user.code }, 
      { profilePicture: imageUrl },
      { new: true }
    );
  
    res.json({ success: true, imageUrl, student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء رفع الصورة' });
  }
});

module.exports = router;