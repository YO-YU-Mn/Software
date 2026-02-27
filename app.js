const express =require("express");
const mongooose = require("mongoose");
const course = require("./Schema/Course");
const app =express();
const cors = require('cors');
app.use(cors()); 
app.use(express.json());
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

app.get("/", (req,res)=>{
    res.send("hello");
})
const Student = require('./Schema/Student'); 

app.post('/login', async (req, res) => {
    try {
        const { student_id, password } = req.body;

        const student = await Student.findOne({ student_id: student_id });

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }
       else if (student.password !== password) {
            return res.status(401).json({ message: "Incorrect password!" });
        }        
       else {res.status(200).json({ 
            message: "Login successful", 
            studentName: student.name 
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/addst" , (req ,res)=>{
    const student_id="123";
    const name = "hello to Cs323";
    const email = "123@gm.co" ;
    const password ="1234" ;
    const department = "math" ;
    const portfolio_skills = ["oop" , "dataBase"];

    const newstu =new Student();
    newstu.student_id=student_id;
    newstu.name=name;
    newstu.email=email;
    newstu.password=password;
    newstu.department=department;
    newstu.portfolio_skills=portfolio_skills;
    
    newstu.save();
    res.send("tmm");
})



