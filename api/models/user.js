const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    unsignedName: {
      type: String,
      required: true,
    },
    avatarUrl: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
      },
    },

    credit: {
      type: Number,
      default: 0,
    },
    favorite: {
      type: Array,
      default: [],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    district: {
      type: String,
    },
    province: {
      type: String,
    },
    school: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    motels: {
      type: Number,
      required: true,
      default: 0,
    },
    posts: {
      type: Number,
      required: true,
      default: 0,
    },
    rank: {
      type: String,
      required: true,
      default: "Người qua đường",
    },
    notify: {
      type: Array,
      required: false,
      default: [],
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
    },
    done: {
      type: [
        {
          title: String,
          content: String,
          createdAt: Date,
          url: String,
        },
      ],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
