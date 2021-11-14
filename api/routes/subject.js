const express = require("express");
const subject = require("../models/subject");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const listSubject = await subject.find({});
    res.status(200).json({ success: true, data: listSubject });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const findSubject = await subject.findById(req.params.id);
    res.status(200).json({ success: true, data: findSubject });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});
module.exports = router;
