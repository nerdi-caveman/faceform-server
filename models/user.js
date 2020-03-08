const mongoose = require("mongoose");

// Schema
const userSchema = mongoose.Schema({
  google_id: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', userSchema);
