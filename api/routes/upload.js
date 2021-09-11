const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/", upload.upload, async(req, res) => {
    if (req.results.length > 0)
        return res
            .status(200)
            .json({ success: true, message: "Thành công", results: req.results });
    else return res.status(500);
});
module.exports = router;