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
            default: "text",
          },
          content: {
            type: String,
            required: false,
            default:
              "Cái này là trường hợp không gửi lên type, hoặc type text mà không gửi content",
          },
          urlImages: {
            type: Array,
            required: false,
            default: [],
          },
          urlGif: {
            type: String,
            required: false,
            default:
              "https://media2.giphy.com/media/JNsDdfwziM7o2yRXqY/giphy.gif?cid=ecf05e47amogfm58zvhevhfde0j8lkujd4qt8yk39209qb4v&rid=giphy.gif&ct=g",
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
            type: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
              },
            ],
            default: [],
          },

          createdAt: { required: true, default: Date.now(), type: Date },
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("group-chat", groupChatSchema);
