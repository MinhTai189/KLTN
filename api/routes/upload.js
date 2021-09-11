const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/uploads", upload.upload, async (req, res) => {
    if (req.results.length > 1)
        return res
            .status(200)
            .json({ success: true, message: "Thành công", data: req.results });
    else if (req.results.length == 1)
        return res
            .status(200)
            .json({ success: true, message: "Thành công", data: req.results[0] });
    else return res.status(500).json({ success: false, message: "Không thể tải hỉnh ảnh!" });
});
module.exports = router;