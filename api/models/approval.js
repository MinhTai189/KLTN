const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const approval = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["post", "motel", "update-motel", "rate"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("approval", approval);
