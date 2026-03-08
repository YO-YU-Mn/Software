const User = require("../models/User")

exports.login = async (req,res)=>{

const {email,password} = req.body

const user = await User.findOne({email})

if(!user){

return res.status(400).json({
message:"user not found"
})

}

if(user.password !== password){

return res.status(400).json({
message:"wrong password"
})

}

res.json({
message:"login success",
user
})

}