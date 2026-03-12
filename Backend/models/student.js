const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    code: { type: Number, required: true , unique:true},
    password: { type: Number, required: true },
    name: { type: String, required: true },
    GPA: { type: Number, default: 0 },
    semester: { type: Number, default: 1 },
    level: { type: String, default: 'Freshman' },
    gradute_year: { type: Number, default: new Date().getFullYear() + 4 },
    specialization: { type: String, default: 'Undeclared' },
    university: { type: String, default: 'Our University' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }

});

module.exports = mongoose.model('Student', studentSchema);