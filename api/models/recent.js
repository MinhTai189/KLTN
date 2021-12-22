const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recent = new Schema({}, { timestamps: true });
module.exports = mongoose.model("recent", recent);
