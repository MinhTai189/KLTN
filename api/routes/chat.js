const express = require("express");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const user = require("../models/user");
const groupChat = require("../models/groupChat");
const router = express.Router();

const chatRouter = (io) => {
  router.post("/groups", verifyToken, async (req, res) => {
    let { members, name } = req.body;
    if (
      !members.some(
        (item) => JSON.stringify(item) === JSON.stringify(req.user.id)
      )
    )
      members = [...members, req.user.id];
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp tên nhóm chat" });
    const newGroupChat = new groupChat({
      name,
      members,
    });
    await newGroupChat.save();
    res.status(200).json({ message: "Thành công", success: true });
  });

  return router;
};

module.exports = chatRouter;
