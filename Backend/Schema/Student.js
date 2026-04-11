// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Student Schema
const StudentSchema = new Schema({
    student_id : {
        type : String,
        sparse : true, 
        unique : true
    },
    name : {
        type : String, 
        required : true
    },
    email : {
        type : String, 
        required : true, 
        unique : true, 
        lowercase : true
    },
    password : {
        type : String, 
        required : false
    },
    department : String,
    portfolio_skills : {
        type : [String], 
        default : []
    },
    createdAT : {
        type : Date, 
        default : Date.now
    },
    // بيانات الربط مع جوجل (Social Login)
    firebaseUid : {
        type : String, 
        unique : true, 
        sparse : true
    },
    authProvider : {
        type : String, 
        enum : ['local' , 'google'], 
        default : 'local'
    }
})

// we must export Student Schema
module.exports = mongoose.model("Student", StudentSchema);