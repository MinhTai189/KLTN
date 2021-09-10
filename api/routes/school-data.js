const express = require("express");
const router = express.Router();
const Districts = require("../models/districts");
const Province = require("../models/province");

const School = require("../models/school");

router.get("/provinces", async (req, res) => {
    //Lấy tất cả tỉnh http://localhost:5000/api/province
    try {
        const province = await Province.find({});
        res.status(200).json({ success: true, data: province });
    } catch {
        res.status(404).json({ success: false, message: "error 404" });
    }
});
router.get("/districts", async (req, res) => {
    try {
        // Lấy quận huyện http://localhost:5000/api/districts/?province=mã tỉnh
        const codeProvince = req.query.province;
        let districts;

        if (codeProvince) {
            districts = await Districts.find({ codeProvince }).select(
                "-codeProvince"
            );
        } else {
            districts = await Districts.find({}).select(
                "-codeProvince"
            );
        }

        res.status(200).json({ success: true, data: districts });
    } catch {
        res.status(404).json({ success: false, message: "error 404" });
    }
});

router.get("/schools", async (req, res) => {
    try {
        //Lậy trường http://localhost:5000/api/school/?province=tinh&district=quan
        //Neu muon lay tat ca truong http://localhost:5000/api/school/
        const codeDistricts = req.query.district;
        const codeProvince = req.query.province;
        if (!codeProvince && !codeDistricts) {
            const school = await School.find({})
                .select("-codeProvince")
                .select("-codeDistricts");
            return res.status(200).json({ success: true, data: school });
        }
        const school = await School.find({ codeDistricts, codeProvince })
            .select("-codeProvince")
            .select("-codeDistricts");
        res.status(200).json({ success: true, data: school });
    } catch (err) {
        res.status(404);
    }
});
module.exports = router;