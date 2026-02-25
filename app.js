const express =require("express");
const mongooose = require("mongoose");
const course = require("./Schema/Course");
const student = require("./Schema/Student");

const app =express();
mongooose
.connect("mongodb+srv://me562697_db_user:KCPlhOWMHb2QiNWz@cluster0.dlyjejk.mongodb.net/?appName=Cluster0")
.then(()=>{
    console.log("connected succecfuly");
    app.listen(3000 ,()=>{
    console.log ("iam listening in port 3000");
    });

}).catch((error)=>{
    console.log("there are an error in connection with mongoose ??~!", error);

});







