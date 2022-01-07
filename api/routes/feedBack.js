const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const feedBack = require("../models/feedBack");
const router = express.Router();

const feekBackRouter = (io) => {
  router.post("/", verifyToken, async (req, res) => {
    const content = req.body.content;
    const title = req.body.title;
    if (!content)
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp nội dung góp ý" });
    const newFeedBack = new feedBack({
      owner: req.user.id,
      content,
      title,
    });
    try {
      await newFeedBack.save();
      res.status(200).json({
        success: true,
        message: "Thành công, xin cảm ơn bạn đã góp ý",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định!" });
    }
  });
  router.delete("/:id", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res.status(400).json({ message: "Ban khong co quyen" });
    const id = req.params.id;
    try {
      const deleteFeedBack = await feedBack.findByIdAndDelete(id);
      if (!deleteFeedBack)
        return res
          .status(400)
          .json({ message: "Không tìm thấy góp ý này", success: true });

      return res.status(200).json({ message: "Thành công", success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định!" });
    }
  });
  router.get("/", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res.status(400).json({ message: "Ban khong co quyen" });
    try {
      const getfeedBack = await feedBack
        .find()
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      return res.status(200).json({
        data: [
          ...getfeedBack.map((item) => {
            return {
              ...item._doc,
              owner: {
                ...item.owner._doc,
                avatarUrl: item.owner.avatarUrl.url,
                totalLikes: item.owner.likes.length,
              },
            };
          }),
        ],
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định!" });
    }
  });
  return router;
};

module.exports = feekBackRouter;
