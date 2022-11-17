const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);