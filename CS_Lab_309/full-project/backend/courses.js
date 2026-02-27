const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
// models file is named `courses.model.js` in this project
const Course = require('./models/courses.model');
const Student = require('./models/student.model');

const CourseApp = express();

// enable CORS for React dev (change origin as needed)
CourseApp.use(cors({ origin: 'http://localhost:3000' }));

CourseApp.use(express.json());
CourseApp.use(express.urlencoded({ extended: false }));

CourseApp.get('/', (req, res) => {
  res.send('Courses API working');
});


CourseApp.post('/addcourse', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: "Course added szzuccessfully", courseId: newCourse._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


CourseApp.get('/courses', async (req, res) => {
  try {
    // populate prerequisites with only the fields we want to expose
    const courses = await Course.find().populate('prerequisites', 'title description hours -_id');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


CourseApp.get('/course/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('prerequisites', 'title description hours -_id');
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


CourseApp.get('/course/title/:title', async (req, res) => {
  try {
    const course = await Course.findOne({ title: req.params.title }).populate('prerequisites', 'title description hours -_id');
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


CourseApp.put('/course/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

CourseApp.delete('/course/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });

    // Remove references from students
    const result = await Student.updateMany(
      { courses: id },
      { $pull: { courses: id } }
    );

    res.json({ message: "Course deleted", removedFromStudents: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === Student <-> Course helper endpoints ===
// add a course to a student
CourseApp.post('/student/:id/addCourse', async (req, res) => {
  try {
    const studentId = req.params.id;
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required in body' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { courses: courseId } },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Course added to student', student: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// remove a course from a student
CourseApp.post('/student/:id/removeCourse', async (req, res) => {
  try {
    const studentId = req.params.id;
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required in body' });

    const updated = await Student.findByIdAndUpdate(
      studentId,
      { $pull: { courses: courseId } },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Course removed from student', student: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/lab5db')
  .then(() => {
    console.log('Connected to MongoDB for Courses');
    CourseApp.listen(7100, () => console.log('CourseApp started on port 7100'));
  })
  .catch(err => console.log('Error connecting to MongoDB', err));
