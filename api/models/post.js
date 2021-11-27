const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const post = new Schema(
  {
    type: {
      type: Number,
      required: true,
    },
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
      required: false,
      default: "",
    },
    tags: {
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

    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
    require: {
      type: Schema.Types.Mixed,
      required: false,
    },
    likes: {
      type: [
        {
          type: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5],
            required: true,
          },
          owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
          },
        },
      ],
      required: true,
      default: [],
    },
    motel: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "motel",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", post);
// {
//   school: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "school",
//     },
//   ],
//   price: {
//     min: Number,
//     max: Number,
//   },
//   optional: {
//     type: Array,
//   },
//   addition: {
//     type: Array,
//     default: [],
//   },
// }
