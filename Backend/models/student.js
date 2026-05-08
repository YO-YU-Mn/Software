const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    code: { type: Number, required: true , unique:true},
    password: { type: String , required: true },
    name: { type: String, required: true },
    GPA: { type: Number, default: 0 },
    semester: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    gradute_year: { type: Number, default: new Date().getFullYear() + 4 },
    specialization: { type: String, default: 'Undeclared' },//department
    university: { type: String, default: 'Cairo university' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    completedCourses: [{ type: String }],   
    currentCourses:   [{ type: String }],   
},  { timestamps: true });
//completeHours: { type: Number, default: 0 }, //can be calculated from completed courses
module.exports = mongoose.model('Student', studentSchema);