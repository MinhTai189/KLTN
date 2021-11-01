const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const feedBack = require("../models/feedBack");
const router = express.Router();
router.post("/", verifyToken, async (req, res) => {
  const content = req.body.content;
  if (!content)
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp nội dung góp ý" });
  const newFeedBack = new feedBack({
    owner: req.user.id,
    content,
  });
  try {
    await newFeedBack.save();
    res
      .status(200)
      .json({ success: true, message: "Thành công, xin cảm ơn bạn đã góp ý" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi không xác định!" });
  }
});
// router.delete("/:id", verifyToken, (req, res) => {
//   const id = req.query.id;
//   try {
//     const deleteFeedBack = await feedBack.findByIdAndDelete(id);
//     if (!deleteFeedBack)
//       return res.status(400).json({ message: "Không tìm thấy góp ý này" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Lỗi không xác định!" });
//   }
// });

module.exports = router;
