const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const review = new Schema({
  // motel: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "motel",
  //   required: true,
  // },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    unique: true,
    required: true,
  },
  cleanup: {
    type: Number,
    required: true,
  },
  road: {
    type: Number,
    required: true,
  },
  beauty: {
    type: Number,
    required: true,
  },
  quiet: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("review", review);
