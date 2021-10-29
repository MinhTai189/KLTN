const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subject = new Schema({
  name: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("subject", subject);
