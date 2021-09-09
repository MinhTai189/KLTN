const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
        type: String,
        required: true,
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
        unique: true,
    },
    district: {
        type: String,
    },
    province: {
        type: String,
    },
    school: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("user", UserSchema);