const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    reply: {
      type: {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        comment: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
      required: false,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [
        {
          type: {
            type: Number,
            enum: [1, 2, 3, 4, 5, 6],
          },
          owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("comment", comment);
