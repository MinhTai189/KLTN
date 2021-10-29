const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const motel = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unsignedName: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
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
    room: [
      {
        optional: {
          wifi: { type: Boolean, required: true },
          ml: { type: Boolean, required: true },
          gac: { type: Boolean, required: true },
          nx: { type: Boolean, required: true },
          camera: { type: Boolean, required: true },
          quat: { type: Boolean, required: true },
          tl: { type: Boolean, required: true },
          giuong: { type: Boolean, required: true },
          gt: { type: Boolean, required: true },
          cc: { type: Boolean, required: true },
          dcvs: { type: Boolean, required: true },
        },
        amount: {
          type: Number,
        },
        price: {
          type: Number,
        },
        area: {
          width: Number,
          length: Number,
        },
        total: Number,
        remain: Number,
        status: Boolean,
      },
    ],
    status: {
      type: Boolean,
      required: true,
    },
    vote: {
      type: Number,
      default: 0,
    },
    rate: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        star: {
          type: Number,
        },
        content: {
          type: String,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
        valid: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],

    mark: {
      default: 0,
      type: Number,
    },
    editor: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        edited: String,
        createdAt: Date,
      },
    ],
    available: {
      type: Number,
    },
    school: [{ type: mongoose.Types.ObjectId, ref: "school" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("motel", motel);
