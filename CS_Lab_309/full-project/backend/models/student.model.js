const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  image: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] 
});

module.exports = mongoose.model('Student', studentSchema);
