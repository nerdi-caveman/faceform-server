const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  theme: {
    background: {
      type: String,
      required: true
    },
    fontFamily: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    labelColor: {
      type: String,
      required: true
    },
    inputColor: {
      type: String,
      required: true
    },
    buttonColor: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model("Templates", schema);
