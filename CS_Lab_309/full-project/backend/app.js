const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const User = require('./models/user.model')

const mongouri = "mongodb://localhost:27017/lab2db"
// app service 
const app = express()

// enable CORS for React dev (change origin as needed)
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Auth routes
const authRouter = require('./routes/auth.routes')
app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
    res.send('Hello World, from cs309');
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.f
        ind({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.get('/user/:id', async (req, res) => {
    
    try {
        // req id 
        const id = req.params.id;
        // find by id in users 
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

app.get('/user/email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email: email }).select('-password');

        if (!user) {
            return res.status(404).json({ message: `Cannot find user with email ${email}` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 
 

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First check if user exists
        const existingUser = await User.findById(id);
        
        if(!existingUser) {
            return res.status(404).json({
                message: `Cannot find user with ID ${id}`
            });
        }
 
        // If user exists, then delete and return response without password
        const user = await User.findByIdAndDelete(id).select('-password');

        // Return success with user details
        res.status(200).json({
            message: 'User deleted successfully',
            deletedUser: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        });
    }
});

app.post('/adduser',  async (req, res) => {

    try{
        //get user object from body 
        let userParam = req.body;
        // validate
        if (await User.findOne({ email: userParam.email })) {
            res.send( 'email "' + userParam.email + '" is already exist');
        }
        
        // Hash password before creating user
        const salt = await bcrypt.genSalt(10);
        userParam.password = await bcrypt.hash(userParam.password, salt);
        
        // Create new user with hashed password
        const user = new User(userParam);
        await user.save();
         res.send("user added successfully ")

    }catch(err)
    {
        res.status(500).send('server error: '+ err);
    }
    
});

app.put('/edituser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let userParam = req.body;

        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: `Cannot find user with ID ${id}` });
        }

        // Check if email exists with another user
        const emailExists = await User.findOne({ email: userParam.email, _id: { $ne: id } });
        if (emailExists) {
            return res.status(400).json({ message: `Email "${userParam.email}" is already in use` });
        }

        // If password is being updated, hash it
        if (userParam.password) {
            const salt = await bcrypt.genSalt(10);
            userParam.password = await bcrypt.hash(userParam.password, salt);
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            userParam,
            { new: true, select: '-password' } // Return updated user without password
        );

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



mongoose.set("strictQuery", false)
mongoose
.connect('mongodb://127.0.0.1:27017/lab2db')
.then(() => {
    console.log('connected to MongoDB')
    //listen on specific port 
    app.listen(8000, () => console.log('app started on port 8000'))
}).catch((error) => {
    console.log('cant connect to mongodb'+error)
})