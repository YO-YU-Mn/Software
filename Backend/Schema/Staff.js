// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Staff Schema
const StaffSchema = new Schema({
    staff_id : {type : String, required : true , unique : true},
    name : {type : String , required : true},
    role : {type : String , required : true},
    department : {type : String , required : true}
})

// we must export Enrollment Schema
module.exports = mongoose.model("Staff", StaffSchema);