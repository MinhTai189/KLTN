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
    messages: {
      type: [
        {
          content: {
            type: {
              type: {
                type: String,
                required: true,
              },
              url: {
                type: String,
                required: false,
                default: "",
              },
              text: {
                type: String,
                required: false,
                default: "",
              },
            },
          },
          owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
          seen: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
            default: false,
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
