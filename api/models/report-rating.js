const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportRating = new Schema({
  motel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  rate: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("report-rating", reportRating);
