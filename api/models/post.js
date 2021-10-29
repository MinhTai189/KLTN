const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const post = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    unsignedTitle: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    hashTag: {
      type: Array,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    block: {
      type: Boolean,
      required: true,
      default: false,
    },
    school: {
      type: Array,
      required: true,
      default: [],
    },
    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", post);
