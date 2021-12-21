const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const access = new Schema(
  {
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("access", access);
