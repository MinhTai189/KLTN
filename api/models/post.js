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

    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
    require: {
      type: {
        school: [
          {
            type: Schema.Types.ObjectId,
            ref: "school",
          },
        ],
        price: {
          min: Number,
          max: Number,
        },
        optional: {
          type: Array,
        },
        area: {
          width: Number,
          height: Number,
        },
        addition: {
          type: Array,
          default: [],
        },
      },
      required: false,
    },
    review: {
      type: {
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
      },
      required: false,
    },
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
    motel: {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "motel",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("post", post);
