const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districts = new Schema({
    codeProvince: {
        type: String,
        required: true,
    },

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

module.exports = mongoose.model("districts", districts);