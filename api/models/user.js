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
      unique: false,
    },
    district: {
      type: Object,
    },
    province: {
      type: Object,
    },
    school: {
      type: Object,
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
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
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
    confirmEmail: {
      default: false,
      type: Boolean,
      required: true,
    },
    banned: {
      type: Date,
      default: Date.now() - 1000 * 60 * 60 * 24,
      require: false,
    },
  },
  { timestamps: true }
);
UserSchema.virtual(
  "usersLike",
  {
    ref: "user",
    localField: "_id",
    foreignField: "likes",

    justOne: false,
  },
  { toJSON: { virtuals: true } }
);

module.exports = mongoose.model("user", UserSchema);
