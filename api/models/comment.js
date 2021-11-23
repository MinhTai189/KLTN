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
        rootComment: {
          type: mongoose.Schema.Types.ObjectId,
        },
        comment: {
          type: mongoose.Schema.Types.ObjectId,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
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
            required: true,
            enum: [0, 1, 2, 3, 4, 5],
          },
          owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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
