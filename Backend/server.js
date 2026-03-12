const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//schema
const Student = require("./models/student");
const Admin = require('./models/admin');

//tokens
const jwt = require('jsonwebtoken');
const SECRET = 'university_secret_key';

const app = express(); //app is the server instance
const port = 9000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://ym884565_db_user:ohih5TaDEp085ENz@cluster0.hfmk9we.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});


app.post('/login', async (req, res) => {
    const { code, password } = req.body;
    
    const student = await Student.findOne({ code, password: Number(password) });
    if(student) {
        const token = jwt.sign({ code, role: 'student' }, SECRET);
        return res.json({ success: true, token, role: 'student' });
    }
    
    const admin = await Admin.findOne({ code, password: Number(password) });
    if(admin) {
        const token = jwt.sign({ code, role: 'admin' }, SECRET);
        return res.json({ success: true, token, role: 'admin' });
    }
    
    res.json({ success: false, message: 'Invalid Password or Code!' });
});

app.post('/addstudent', async (req, res) => {
    const { code, password } = req.body;  
    const existingStudent = await Student.findOne({ code });
    if(existingStudent) {
        return res.json({ success: false, message: 'Student already exists!' });
    } 
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ success: true, message: 'Registration successful!' ,addedStudent:newStudent});
} 
);

app.delete('/deletestudent/:code', async (req, res) => {
    const { code } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ code });
    if(!deletedStudent) {
        return res.json({ success: false, message: 'Student not found!' });
    } 
    res.json({ success: true, message: 'Student deleted successfully!' , student: deletedStudent });
});

app.put('/updatestudent/:code', async (req, res) => {
    const { code } = req.params;
    if(!code) {
        return res.json({ success: false, message: 'student is not found!' });
    }
  
    const { password, name, GPA, semester, level, gradute_year, specialization, university, course, email, phone, address } = req.body;
    const updatedStudent = await Student.findOneAndUpdate({ code }, { password, name, GPA, semester, level, gradute_year, specialization, university, course, email, phone, address }, { new: true });
    if(!updatedStudent) {
        return res.json({ success: false, message: 'Student not found!' });
    }
    res.json({ success: true, message: 'Student updated successfully!' , student: updatedStudent });
});

app.get('/student/profile', async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, SECRET);
    // جيب الطالب من الـ Database
    const student = await Student.findOne({ code: decoded.code });
    res.json(student);
});

app.post('/addadmin', async (req, res) => {
    const { code, password } = req.body;
    const existingAdmin = await Admin.findOne({ code });
    if(existingAdmin) {
        return res.json({ success: false, message: 'Admin already exists!' });
    } 
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.json({ success: true, message: 'Admin added!' ,addedAdmim:newAdmin});
});

app.put('/updateadmin/:code', async (req, res) => {
    const { code } = req.params;
    const { password, email, name } = req.body;     
    const updatedAdmin = await Admin.findOneAndUpdate(
        { code },
        { password, name, email },
        { new: true }
    );
    
    if(!updatedAdmin) {
        return res.json({ success: false, message: 'Admin not found!' });
    }
    
    res.json({ success: true, message: 'Admin updated successfully!', admin: updatedAdmin });
});


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});