const express = require("express");
const router = express.Router();
const Districts = require("../models/districts");
const Province = require("../models/province");

const School = require("../models/school");

router.get("/province", async(req, res) => {
    //Lấy tất cả tỉnh http://localhost:5000/api/province
    try {
        const province = await Province.find({});
        res.status(200).json({ success: true, data: province });
    } catch {
        res.status(404).json({ success: false, message: "error 404" });
    }
});
router.get("/districts", async(req, res) => {
    try {
        // Lấy quận huyện http://localhost:5000/api/districts/?code=mã tỉnh
        const codeProvince = req.query.code;
        const districts = await Districts.find({ codeProvince }).select(
            "-codeProvince"
        );

        res.status(200).json({ success: true, data: districts });
    } catch {
        res.status(404).json({ success: false, message: "error 404" });
    }
});
router.get("/school", async(req, res) => {
    try {
        //Lậy trường http://localhost:5000/api/school/?code=mã quận huyện
        const codeDistricts = req.query.code;
        const school = await School.find({ codeDistricts });
        res.status(200).json({ success: true, data: school });
    } catch {
        res.status(404).json({ success: false, message: "error 404" });
    }
});
module.exports = router;