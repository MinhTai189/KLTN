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
    school: [
      {
        type: Schema.Types.ObjectId,
        ref: "school",
      },
    ],
    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
    require: {
      type: Array,
      required: true,
      default: [],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    likes: [
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
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", post);
