// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Student Schema
const StudentSchema = new Schema({
    student_id : {type : String, required : true , unique : true},
    name : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    department : String,
    portfolio_skills : [String]
})

// we must export Student Schema
module.exports = mongoose.model("Student", StudentSchema);