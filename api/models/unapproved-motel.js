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
        createAt: {
            type: Date,
            default: Date.now,
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

module.exports = mongoose.model("unpproved-motel", unpprovedMotel);