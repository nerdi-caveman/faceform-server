const mongoose = require("mongoose");
const schema = mongoose.Schema({
  items: [
    {
      question: { type: String, required: true },
      answer: { type: String },
      type: { type: String }
    }
  ],
  form_id: {
    type: String || mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Forms"
  },
  user_id: {
    type: String,
    required: true
  },
  viewed: {
    type: String,
    default: "0"
  }
});

module.exports = mongoose.model("Results", schema);
