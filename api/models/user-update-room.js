const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userUpdateRoom = new Schema({
  type: {
    type: String,
    enum: ["push", "pull", "set"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  motel: {
    type: mongoose.Types.ObjectId,
    ref: "motel",
  },
  room: {
    type: String,
  },
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
});
module.exports = mongoose.model("user-update-room", userUpdateRoom);
