const mongoose = require("mongoose");

const schema = mongoose.Schema({
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Forms"
  }
});

module.exports = mongoose.model("Publish", schema);
