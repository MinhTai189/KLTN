const express = require("express");
const router = express.Router();
const user = require("../models/user");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const favoriteRouter = (io) => {
  router.post("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const findMotel = await motel.findById(id);
    if (!findMotel)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà trọ" });
    const findUser = await user.findById(req.user.id);
    if (!findUser)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    if (
      findUser.favorite.some((item) => {
        return JSON.stringify(item) === JSON.stringify(id);
      }) == true
    )
      return res.status(409).json({
        success: false,
        message: "Nhà trọ này đã nằm trong danh sách yêu thích",
      });
    findUser.favorite.push(id);

    try {
      await findUser.save();
      findMotel.favorites = findMotel.favorites + 1;
      await findMotel.save();
      return res.status(200).json({ success: true, message: "Thành công" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Lỗi" });
    }
  });
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const findUser = await user.findById(req.user.id);
      if (!findUser)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      if (
        findUser.favorite.some((item) => {
          return JSON.stringify(item) === JSON.stringify(req.params.id);
        }) == true
      )
        await motel.findByIdAndUpdate(req.params.id, {
          $inc: { favorites: -1 },
        });
      await user.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { favorite: req.params.id } }
      );
      res.status(200).json({ success: true, message: "Thành công" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  return router;
};
module.exports = favoriteRouter;
