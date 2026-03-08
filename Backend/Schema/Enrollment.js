// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Enrollment Schema
const EnrollmentSchema = new Schema({
    enrollment_id : {type : String, required : true , unique : true},
    student_id : {type : String, required : true },
    course_id : {type : String, required : true },
    semester : {type : String , required : true},
    grade : {type : String }
})

// we must export Enrollment Schema
module.exports = mongoose.model("Enrollment", EnrollmentSchema);