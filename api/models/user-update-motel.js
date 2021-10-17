const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userUpdateMotel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unsignedName: {
      type: String,
    },
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    images: Array,
    address: {
      type: String,
      require: true,
    },

    desc: { type: String },

    contact: {
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      facebook: {
        type: String,
      },
      zalo: {
        type: String,
      },
    },

    status: {
      type: Boolean,
      required: true,
    },
    available: {
      type: Number,
    },

    school: [{ type: mongoose.Types.ObjectId, ref: "school" }],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    motel: {
      type: mongoose.Types.ObjectId,
      ref: "motel",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user-update-motel", userUpdateMotel);
