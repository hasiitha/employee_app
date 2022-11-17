const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  
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