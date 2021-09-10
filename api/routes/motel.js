const express = require("express");
const router = express.Router();
const motel = require("../models/motel");
const user = require("../models/user");
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const unapprovedMotel = require("../models/unapproved-motel");

router.get("/motels", verifyToken, (req, res) => {});
router.post("/motels", verifyToken, async(req, res) => {
    const {
        id,
        name,
        images,
        district,
        province,
        price,
        desc,
        room,
        contact,
        area,
        status,
    } = req.body;
    if (id) {
        if (req.user.isAdmin == false)
            return res
                .status(405)
                .json({ success: false, message: "Không đủ quyền hạn truy cập" });
        const checkMotel = await unapprovedMotel.findByIdAndDelete(id);
        if (!checkMotel)
            return res
                .status(400)
                .json({ success: false, message: "Không tìm thấy" });

        const newMotel = new motel({
            name: checkMotel.name,
            unsignedName: checkMotel.unsignedName,
            images: checkMotel.images,
            district: checkMotel.district,
            province: checkMotel.province,
            price: checkMotel.price,
            desc: checkMotel.desc,
            room: checkMotel.room,
            contact: checkMotel.contact,
            area: checkMotel.area,
            status: checkMotel.status,
            vote: checkMotel.vote,
            rate: checkMotel.rate,
            mark: checkMotel.mark,
            school: checkMotel.school,
            owner: checkMotel.owner,
            editor: checkMotel.editor,
        });
        try {
            await newMotel.save();
            return res.status(200).json({
                success: true,
                message: "duyệt thành công",
            });
        } catch (err) {
            console.log(err);
            await checkMotel.save();
            return res.status(500).json({
                success: false,
                message: "Vui lòng thử lại",
            });
        }
    }
    if (!name || name === "")
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp tên nhà trọ" });
    if (!district || !province || district === "" || province === "")
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp địa chỉ nhà trọ" });
    if (!price)
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp giá nhà trọ" });
    if (!desc)
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp một vài mô tả" });
    if (!room)
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp số phòng nhà trọ" });
    if (!contact ||
        (!contact.phone && !contact.email && !contact.facbook && !contact.zalo)
    )
        return res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp ít nhất một cách liên lạc nhà trọ",
        });
    if (!area.length ||
        !area.width ||
        typeof area.length !== "number" ||
        typeof area.width !== "number"
    )
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp diện tích nhà trọ" });
    if (typeof status == "undefined")
        return res.status(400).json({
            success: false,
            message: "Vui lòng cho biết còn phòng trống hay không",
        });
    const checkUserPost = await user.findById(req.user.id).select("credit");
    if (req.user.isAdmin == true || checkUserPost.credit >= 100) {
        const newMotel = new motel({
            name,
            unsignedName: removeVietNameseTones(name),
            images,
            district,
            province,
            price,
            desc,
            room,
            contact,
            area,
            status,
            vote: undefined,
            rate: [],
            mark: undefined,
            school: [],
            owner: req.user.id,
            editor: req.user.id,
        });
        try {
            await newMotel.save();
            return res.status(200).json({
                success: true,
                message: "Thêm thành công",
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Vui lòng thử lại",
            });
        }
    } else {
        const newMotel = new unapprovedMotel({
            name,
            unsignedName: removeVietNameseTones(name),
            images,
            district,
            province,
            price,
            desc,
            room,
            contact,
            area,
            status,
            vote: undefined,
            rate: [],
            mark: undefined,
            school: [],
            owner: req.user.id,
            editor: req.user.id,
        });
        try {
            await newMotel.save();
            return res.status(200).json({
                success: true,
                message: "Thêm thành công, vui lòng chờ duyệt",
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Vui lòng thử lại",
            });
        }
    }
});