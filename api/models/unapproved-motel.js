const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const unapprovedMotel = new Schema({
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
    images: [{
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    }, ],
    districts: {
        type: Schema.Types.ObjectId,
        ref: "districts",
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: "province",
    },
    price: {
        type: Number,
        required: true,
    },
    desc: { type: String },
    room: {
        type: Number,
        required: true,
    },
    contact: {
        Phone: {
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
    area: {
        length: {
            type: Number,
        },
        width: {
            type: Number,
        },
    },
    status: {
        type: Boolean,
        required: true,
    },
    vote: {
        type: Number,
        default: 0,
    },
    rate: [{
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
    }, ],
    mark: {
        default: 0,
        type: Number,
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    school: [{ type: mongoose.Types.ObjectId, ref: "school" }],
}, { timestamps: true });

module.exports = mongoose.model("unapproved-motel", unapprovedMotel);