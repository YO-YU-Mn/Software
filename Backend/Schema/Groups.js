// we require mongoose library
const mongoose = require("mongoose");

// we create a schema form mongoose
const Schema = mongoose.Schema;

//Groups Schema
const GroupsSchema = new Schema({
    group_id : {type : String, required : true , unique : true},
    group_name : {type : String , required : true},
    group_type : {type : String , required : true},
    members_ids : {type : [String] , required : true},
    admin_id : {type : String , required : true}
})

// we must export Enrollment Schema
module.exports = mongoose.model("Groups", GroupsSchema);