const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  studentCode: String,
  expoPushToken: String,
});

module.exports = mongoose.model('PushToken', pushTokenSchema);