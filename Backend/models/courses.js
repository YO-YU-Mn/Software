const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({

    course_id : {type : String, required : true , unique : true},
    title : {type : String , required : true},
    credits : {type : Number , required : true},
    instructor :{type :String ,required : true},
    department:   { type: String, required: true }, 
    level:        { type: Number, required: true }, 
    semester:     { type: Number, required: true }, 
    enrolledStudents: { type: Number, default: 0 },
    capacity:         { type: Number, default: 30 },
    prerequisites: { type: [{ type: String }], default: [] },
    schedule:[
        {
        day:      { type: String },
        time:     { type: String },
        location: { type: String }
        }
    ]
});

module.exports = mongoose.model("course", coursesSchema);