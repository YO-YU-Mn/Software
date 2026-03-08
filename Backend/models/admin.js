const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    code: { type: Number, required: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    name: { type: String, required: false }

});

module.exports = mongoose.model('admin', adminSchema);