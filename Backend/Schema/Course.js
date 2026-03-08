// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Courses Schema
const CoursesSchema = new Schema({
    course_id : {type : String, required : true , unique : true},
    title : {type : String , required : true},
    credits : {type : Number , required : true},
    prerequisites : {type : [String] , required : true},
    skills_gained : [String]
})

// we must export Course Schema
module.exports = mongoose.model("Course", CoursesSchema);