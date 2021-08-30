const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const school = new Schema({
    codeProvince: {
        type: String,
        required: true,
    },
    codeDistricts: {
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

module.exports = mongoose.model("school", school);