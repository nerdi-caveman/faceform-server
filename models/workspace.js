const mongoose = require("mongoose");

const workspaceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  form_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Forms"
  },
  response: {
    type:String
  }
});
module.exports = mongoose.model("Workspaces", workspaceSchema);
