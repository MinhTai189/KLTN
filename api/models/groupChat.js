const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupChatSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: "",
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
      default: "group",
    },
    messages: {
      type: [
        {
          type: {
            type: String,
            required: true,
            enum: ["text", "image", "link", "gif"],
          },
          content: {
            type: String,
            required: false,
            default: "",
          },
          urlImages: {
            type: Array,
            required: false,
          },
          urlGif: {
            type: String,
            required: false,
          },
          dataLink: {
            type: Object,
            required: false,
          },
          owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          seen: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
            default: [],
          },
          createdAt: { required: true, default: new Date(), type: Date },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("group-chat", groupChatSchema);
