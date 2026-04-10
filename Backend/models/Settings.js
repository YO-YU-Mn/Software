const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    registrationOpen: { type: Boolean, default: false },
    currentSemester: { type: String, default: 'Fall 2025' },
    maxCreditHours: { type: Number, default: 18 },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Settings', settingsSchema);