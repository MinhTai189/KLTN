const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    tag: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("comment", comment);
