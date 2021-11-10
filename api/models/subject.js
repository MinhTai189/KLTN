const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subject = new Schema({
  name: {
    type: String,
    required: true,
  },
  posts: {
    type: Number,
    required: true,
    default: 0,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
});
module.exports = mongoose.model("subject", subject);
