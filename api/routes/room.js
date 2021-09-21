const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const motel = require("../models/motel");

router.post("/:id", verifyToken, async(req, res) => {
    if (!req.params.id)
        return res.status(400).json({
            success: false,
            message: "Không nhận được nhà trọ cần cập nhật",
        });
    const id = req.params.id;
    const { optional, amount, price, area, total, remain, status } = req.body;

    if (
        Array.isArray(optional) == false ||
        typeof amount !== "number" ||
        typeof price !== "number" ||
        typeof area !== "object" ||
        typeof total !== "number" ||
        typeof remain !== "number" ||
        typeof status !== "boolean"
    ) {
        return res.status(400).json({ success: false, message: "Sai dữ liệu" });
    }
    let optionalFixed = {
        wifi: false,
        ml: false,
        gac: false,
        nx: false,
        camera: false,
        quat: false,
        tl: false,
        giuong: false,
        gt: false,
        cc: false,
        dcvs: false,
    };
    for (let i = 0; i < optional.length; i++) {
        optionalFixed[optional[i]] = true;
    }

    if (req.user.isAdmin == true)
        try {
            const motelUpdate = await motel.findByIdAndUpdate(id, {
                room: {
                    $push: {
                        optional: optionalFixed,
                        amount,
                        area,
                        total,
                        remain,
                        status,
                    },
                },
            });
            if (!motelUpdate)
                return res
                    .status(400)
                    .json({ success: false, message: "Không tồn tại nhà trọ" });
            res.status(200).json({ success: true, message: "Cập nhật thành công" });
        } catch {
            return res
                .status(500)
                .json({ success: false, message: "Lỗi không xác định" });
        }
});
router.patch("/:id/:idRoom", verifyToken, async(req, res) => {
    const { optional, amount, price, area, total, remain, status } = req.body;

    if (!req.params.id || !req.params.idRoom)
        return res.status(400).json({
            success: false,
            message: "Không nhận được thông tin cần thiết để xóa loại phòng",
        });
    const id = req.params.id;
    const idRoom = req.params.idRoom;
    const findMotel = await motel.findById(id);
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tồn tại nhà trọ" });
    const findRoom = findMotel.room.find(
        (item) => JSON.stringify(item._id) === JSON.stringify(idRoom)
    );
    if (!findRoom)
        return res
            .status(400)
            .json({ success: false, message: "Không tồn tại loại phòng này" });
    if (
        Array.isArray(optional) == false &&
        typeof amount !== "number" &&
        typeof price !== "number" &&
        typeof area !== "object" &&
        typeof total !== "number" &&
        typeof remain !== "number" &&
        typeof status !== "boolean"
    ) {
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy dữ liệu mới" });
    }
    newData = {};

    if (optional) {
        var optionalFixed = {
            wifi: false,
            ml: false,
            gac: false,
            nx: false,
            camera: false,
            quat: false,
            tl: false,
            giuong: false,
            gt: false,
            cc: false,
            dcvs: false,
        };
        for (let i = 0; i < optional.length; i++) optionalFixed[optional[i]] = true;
        newData.optional = optionalFixed;
    }
    if (typeof amount === "number") newData.amount = amount;
    if (typeof price === "number") newData.price = price;
    if (area)
        if (typeof area.width === "number" && typeof area.length === "number")
            newData.area = area;
    if (typeof total === "number") newData.total = total;
    if (typeof remain === "number") newData.remain = remain;
    if (typeof status === "boolean") newData.status = status;
    if (req.user.isAdmin == true) {
        try {
            console.log(newData);
            await motel.findOneAndUpdate({ _id: id, "room._id": idRoom }, {
                $set: {
                    "room.$.area": newData.area,
                    "room.$.amount": newData.amount,
                    "room.$.price": newData.price,
                    "room.$.status": newData.status,
                    "room.$.remain": newData.remain,
                    "room.$.optional": newData.optional,
                    "room.$.total": newData.total,
                },
            });
            return res.status(200).json({ success: true, message: "Thành công" });
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: "Lỗi không xác định" });
        }
    }
});
router.delete("/:id/:idRoom", verifyToken, async(req, res) => {
    if (!req.params.id || !req.params.idRoom)
        return res.status(400).json({
            success: false,
            message: "Không nhận được thông tin cần thiết để xóa loại phòng",
        });
    const id = req.params.id;
    const idRoom = req.params.idRoom;
    const findMotel = await motel.findById(id);
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tồn tại nhà trọ" });
    const findRoom = findMotel.room.find(
        (item) => JSON.stringify(item._id) === idRoom
    );
    if (!findRoom)
        return res
            .status(400)
            .json({ success: false, message: "Không tồn tại loại phòng này" });
    if (req.user.isAdmin == true)
        try {
            await motel.findOneAndUpdate({ _id: id }, { $pull: { room: { _id: idRoom } } });
            res.status(200).json({ success: true, message: "Cập nhật thành công" });
        } catch {
            return res
                .status(500)
                .json({ success: false, message: "Lỗi không xác định" });
        }
});

module.exports = router;