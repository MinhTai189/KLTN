const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/uploads", upload.upload, async(req, res) => {
    if (req.results.length > 1)
        return res
            .status(200)
            .json({ success: true, message: "Thành công", data: req.results });
    else if (req.results.length == 1)
        return res
            .status(200)
            .json({ success: true, message: "Thành công", data: req.results[0] });
    else
        return res
            .status(500)
            .json({ success: false, message: "Không thể tải hỉnh ảnh!" });
});
router.delete("/uploads/:public_id", async(req, res) => {
    const public_id = req.params.public_id;
    const unlink = await upload.unlink(public_id);
    if (unlink.success)
        res.status(200).json({ success: true, message: "Đã xóa file" });
    else
        res
        .status(500)
        .json({ success: false, message: "Không thể xóa hỉnh ảnh!" });
});
module.exports = router;