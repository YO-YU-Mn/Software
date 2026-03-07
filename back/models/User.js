const mongoose = require("mongoose")
// const mongoose = require("mongoose")

mongoose.connect(
"mongodb://localhost:27017/myapp"
)

const UserSchema = new mongoose.Schema({

email:String,
password:String

})

module.exports = mongoose.model("User",UserSchema)