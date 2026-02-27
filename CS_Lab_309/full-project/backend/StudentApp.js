require('dotenv').config();

const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Student = require('./models/student.model')
const Course = require('./models/courses.model')
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ADMIN_EMAILS = [
  'student@example.com',
  'bdalmwluyb@gmail.com',
  'bdawlmwluyb@gmail.com',
  'mostafa12@gmail.com'
];
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCYr99fTJHXu_Kzu5Y083gI4VxKO42n8f0';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const mongouri = "mongodb://localhost:27017/lab5db"
// app service 
const StudentApp = express()

// enable CORS for React dev (change origin if your frontend runs elsewhere)
StudentApp.use(cors({ origin: 'http://localhost:3000' }))

StudentApp.use(express.json())
StudentApp.use(express.urlencoded({extended: false}))

// Login endpoint
StudentApp.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const student = await Student.findOne({ email: { $regex: `^${emailLower}$`, $options: 'i' } });
    
    if (!student) {
      return res.status(401).json({ message: ' الايميل غير مسجل في النظام' });
    }

    const isAdmin = ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === emailLower);
    if (!isAdmin) {
      return res.status(403).json({ message: ' أنت غير مصرح بالدخول - هذا الايميل ليس لديه صلاحيات أدمن' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: ' الباسورد غلط' });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email }, 
      process.env.JWT_SECRET || 'SecretKey123',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: ' تم تسجيل الدخول بنجاح', 
      token, 
      studentId: student._id,
      email: student.email 
    });

  } catch (error) {
    res.status(500).json({ message: 'حصلت مشكلة في السيرفر', error: error.message });
  }
});

StudentApp.get('/', (req, res) => {
    res.send('Hello World, from cs309');
});

StudentApp.get('/students', async (req, res) => {
    try {
        const students = await Student.find({}).select('-password').populate('courses', 'title');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

StudentApp.get('/student/:id', async (req, res) => {
    
    try {
        const id = req.params.id;
        const foundStudent = await Student.findById(id).select('-password').populate('courses', 'title');
        if (!foundStudent) return res.status(404).json({ message: `Cannot find student with ID ${id}` });
        res.status(200).json(foundStudent);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

StudentApp.get('/student/email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const foundStudent = await Student.findOne({ email }).select('-password').populate('courses', 'title');

        if (!foundStudent) {
            return res.status(404).json({ message: `Cannot find student with email ${email}` });
        }
        res.status(200).json(foundStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
 

StudentApp.delete('/student/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // First check if student exists
        const existingStudent = await Student.findById(id);

        if(!existingStudent) {
            return res.status(404).json({
                message: `Cannot find student with ID ${id}`
            });
        }

        // If student exists, then delete and return response without password
        const deletedStudent = await Student.findByIdAndDelete(id).select('-password');

        // Return success with student details
        res.status(200).json({
            message: 'Student deleted successfully',
            deletedStudent: {
                id: deletedStudent._id,
                email: deletedStudent.email,
                fullName: deletedStudent.fullName
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting student',
            error: error.message
        });
    }
});

StudentApp.post('/addstudent',  async (req, res) => {

    try{
        //get student object from body 
        let studentParam = req.body;
        // validate
        if (await Student.findOne({ email: studentParam.email })) {
            return res.status(400).json({ message: `email "${studentParam.email}" is already exist` });
        }
        
        // Hash password before creating student
        const salt = await bcrypt.genSalt(10);
        studentParam.password = await bcrypt.hash(studentParam.password, salt);
        
        // Create new student with hashed password
        const newStudent = new Student(studentParam);
        await newStudent.save();
        res.status(201).json({ message: "student added successfully", studentId: newStudent._id })

    }catch(err)
    {
        res.status(500).send('server error: '+ err);
    }
    
});

// Reset password endpoint
StudentApp.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email و Password مطلوبة' });
    }

    const student = await Student.findOne({ email: { $regex: `^${email.toLowerCase()}$`, $options: 'i' } });
    if (!student) {
      return res.status(404).json({ message: 'الطالب غير موجود' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.status(200).json({ message: ' تم تغيير الباسورد بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
});
StudentApp.get('/student/:id/courses', async (req, res) => {
    
    try {
        const id = req.params.id;
        const foundStudent = await Student.findById(id).select('-password').populate('courses', 'title description hours -_id');
        if (!foundStudent) return res.status(404).json({ message: `Cannot find student with ID ${id}` });
        res.status(200).json({
            message: `Courses for student ${foundStudent.fullName}`,
            courses: foundStudent.courses
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

StudentApp.put('/editstudent/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let studentParam = req.body;

        // Check if student exists
        const existingStudent = await Student.findById(id);
        if (!existingStudent) {
            return res.status(404).json({ message: `Cannot find student with ID ${id}` });
        }

        // Check if email exists with another student
        if (studentParam.email) {
            const emailExists = await Student.findOne({ email: studentParam.email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ message: `Email "${studentParam.email}" is already in use` });
            }
        }

        // If password is being updated, hash it
        if (studentParam.password) {
            const salt = await bcrypt.genSalt(10);
            studentParam.password = await bcrypt.hash(studentParam.password, salt);
        }

        // Update student
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            studentParam,
            { new: true, select: '-password' } // Return updated student without password
        );

        res.status(200).json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

StudentApp.get('/generate-schedule', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyCtLOW2S8YoGWzrsfCBNjRVBwtVLkk1ry0') {
      return res.status(400).json({ message: ' API Key غير صحيح - تأكد من ملف .env' });
    }

    const courses = await Course.find({}).limit(10);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'لا توجد مواد في الداتاباز' });
    }

    const coursesText = courses.map(c => ({
      title: c.title,
      hours: c.hours || 2,
      description: c.description || ''
    }));

    console.log(' المواد:', coursesText);
    console.log(' API Key متوفر:', !!process.env.GEMINI_API_KEY);

    // اختيار نموذج صالح من قائمة مرشحة
    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5', 'gemini-pro'];
    let model;
    let validationResult;

    for (const m of candidateModels) {
      try {
        model = genAI.getGenerativeModel({ model: m });
        console.log(`محاولة النموذج ${m}`);
        validationResult = await model.generateContent('');
        console.log(`النموذج ${m} صالح`);
        break;
      } catch (err) {
        console.warn(`النموذج ${m} فشل: ${err.message}`);
      }
    }

    if (!validationResult) {
      throw new Error('لا توجد نماذج متاحة أو جميعها فشلت');
    }
    
    const prompt = `أنت مساعد إنشاء جداول دراسية. 

هذه المواد المتاحة:
${coursesText.map((c, i) => `${i + 1}. ${c.title}`).join('\n')}

أنشئ جدول دراسي أسبوعي منظم. يجب أن ترد JSON فقط بدون أي نصوص إضافية.

الصيغة المطلوبة بالضبط:
{
  "schedule": [
    {
      "day": "السبت",
      "sessions": [
        {"time": "08:00-10:00", "course": "مادة", "room": "A101"},
        {"time": "10:00-10:15", "course": "راحة", "room": ""},
        {"time": "10:15-12:15", "course": "مادة أخرى", "room": "A102"}
      ]
    }
  ]
}

استخدم المواد المذكورة أعلاه بشكل عشوائي. أضف فترات راحة بانتظام.`;

    console.log(' الـ Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log(' رد Gemini كاملاً:', responseText);

    // استخرج JSON من الرد
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'فشل في استخراج JSON من الرد', response: responseText });
    }

    const schedule = JSON.parse(jsonMatch[0]);

    res.status(200).json({
      message: ' تم توليد الجدول بنجاح',
      schedule: schedule
    });

  } catch (error) {
    console.error(' Gemini Error Details:');
    console.error('- Message:', error.message);
    console.error('- Status:', error.status);
    console.error('- Code:', error.code);
    console.error('- Full Error:', JSON.stringify(error, null, 2));
    
    let errorMessage = 'خطأ في الاتصال مع Google Gemini';
    
    if (error.message?.includes('API key')) {
      errorMessage = ' API Key غير صحيح أو expired';
    } else if (error.message?.includes('quota')) {
      errorMessage = ' تجاوزت حدود الاستخدام اليومي';
    } else if (error.message?.includes('model')) {
      errorMessage = ' النموذج غير متاح';
    }
    
    res.status(500).json({ 
      message: errorMessage, 
      error: error.message,
      debugInfo: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        status: error.status,
        fullError: error.message
      } : undefined
    });
  }
});

// debug endpoint for listing available Gemini models
StudentApp.get('/models', async (req, res) => {
  try {
    const list = await genAI.listModels();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list models', error: err.message });
  }
});

mongoose.set("strictQuery", false)
mongoose
.connect('mongodb://127.0.0.1:27017/lab5db')
.then(() => {
    console.log('connected to MongoDB')
    //listen on specific port 
    StudentApp.listen(7000, () => console.log('StudentApp started on port 7000'))
}).catch((error) => {
    console.log('cant connect to mongodb'+error)
})