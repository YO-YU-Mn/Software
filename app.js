const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const authRouter = require("./routes/auth");

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/auth', authRouter);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// MongoDB Connection
mongoose.connect("mongodb+srv://me562697_db_user:KCPlhOWMHb2QiNWz@cluster0.dlyjejk.mongodb.net/?appName=Cluster0")
    .then(() => {
        console.log("✓ Connected to MongoDB successfully");
        app.listen(3000, () => {
            console.log("✓ Server is listening on port 3000");
        });
    })
    .catch((error) => {
        console.error("✗ Error connecting to MongoDB:", error.message);
        process.exit(1);
    });



