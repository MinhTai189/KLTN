const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const unpprovedMotel = new Schema({
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
    address: {
        type: String,
        require: true,
    },

    desc: { type: String },

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
        createAt: {
            type: Date,
            default: Date.now,
        },
    }, ],
    room: [{
        optional: {
            type: Array,
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
    }, ],
    mark: {
        default: 0,
        type: Number,
    },
    editor: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    available: {
        type: Number,
    },
    duplicateUnapproved: [{ type: mongoose.Types.ObjectId, ref: "motel" }],
    school: [{ type: mongoose.Types.ObjectId, ref: "school" }],
    duplicate: [{ type: mongoose.Types.ObjectId, ref: "motel" }],
}, { timestamps: true });

module.exports = mongoose.model("unpproved-motel", unpprovedMotel);