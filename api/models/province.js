const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const province = new Schema({
    name: {
        type: String,
        required: true,
    },
    codeName: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("province", province);