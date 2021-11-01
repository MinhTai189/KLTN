const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const report = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    id1: {
      type: String,
      required: true,
    },
    id2: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("report", report);
