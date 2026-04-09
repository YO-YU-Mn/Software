const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    studentCode: { type: String }, 
    title:       { type: String, required: true },
    description: { type: String, required: true },
    date:        { type: String, required: true },
    target: { 
        type: String, 
        enum: ['all', 'specific', 'level1', 'level2', 'level3', 'level4'], 
        default: 'all' 
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
});

module.exports = mongoose.model("Notification", notificationSchema);