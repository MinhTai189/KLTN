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
    nameDistricts: {
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
    logo: {
        type: String,
    },
});

module.exports = mongoose.model("school", school);