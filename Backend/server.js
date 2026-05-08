const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); 

//schemas
const Student = require("./models/student");
const Admin = require('./models/admin');


//tokens
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'university_secret_key';

//routes
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const statsRoutes = require('./routes/statsRoutes');
const bulkImportRoutes = require('./routes/BulkImport');
const bulkCourseRoutes = require('./routes/bulkCourseRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const advisorRoutes = require('./routes/advisorRoutes');


const app = express(); 
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/admins", adminRoutes);
app.use("/news", newsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/settings", settingsRoutes);
app.use('/notifications', notificationRoutes);
app.use('/news', newsRoutes);
app.use('/settings', settingsRoutes);
app.use('/stats', statsRoutes);
app.use('/bulkImport', bulkImportRoutes);
app.use('/bulkCourses', bulkCourseRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/advisor', advisorRoutes);



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


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err)); 


// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});