const mongoose = require("mongoose");
// Users.findOneAndUpdate({name: req.user.name}, {$push: {friends: friend}});
const schema = mongoose.Schema({
  items: [
    { question: { type: String, required: true }, answer: { type: String } }
  ],
  publish_id: {
    type: String || mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Publish"
  }
});

module.exports = mongoose.model("Results", schema);
