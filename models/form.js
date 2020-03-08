const mongoose = require("mongoose");

const schema = mongoose.Schema({
  form: [
    {
      label: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  ],
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Templates"
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users"
  }
});

module.exports = mongoose.model("Forms", schema);
