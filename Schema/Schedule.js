// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

// Schedule Schema 
const ScheduleSchema = new Schema({
    schedule_id : {type : String, required : true , unique : true},
    course_id : {type : String, required : true , unique : true},
    staff_id : {type : String, required : true , unique : true},
    day : {type : String , required : true},
    start_time : {type : String , required : true},
    end_time : {type : String , required : true},
    room : {type : String , required : true}
})

// we must export Schedule Schema
module.exports = mongoose.model("Schedule", ScheduleSchema);