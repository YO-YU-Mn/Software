const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); 
// يجب أن يكون هذا السطر قبل استيراد أي ملفات أخرى تستخدم الـ API Key
//schemas
const Student = require("./models/student");
const Admin = require('./models/admin');


//tokens
const jwt = require('jsonwebtoken');
const SECRET = 'university_secret_key';

//routes
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const statsRoutes = require('./routes/statsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');





const app = express(); //server instance
const port = 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/admins", adminRoutes);
app.use("/news", newsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/settings", settingsRoutes);

app.use("/chatbot", chatbotRoutes);

app.use('/notifications', notificationRoutes);
app.use('/news', newsRoutes);
app.use('/settings', settingsRoutes);
app.use('/stats', statsRoutes);
// app.use('/chatbot', chatbotRoutes);


//login Authontication
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


// MongoDB Connection   mongodb+srv://me562697_db_user:<db_password>@cluster0.eqdhkz6.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://MostafaMR7_db_user:PZm0rvQ0A0HVkV7u@clusterbymr7.ptds641.mongodb.net/?appName=ClusterByMR7")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err)); 


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});