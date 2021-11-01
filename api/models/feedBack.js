const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedBack = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("feedBack", feedBack);
