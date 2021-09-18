const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const router = express.Router();
const motel = require("../models/motel");

router.patch("/:id", verifyToken, async(req, res) => {
    if (!req.params.id)
        return res.status(400).json({
            success: false,
            message: "Không nhận được nhà trọ cần cập nhật",
        });
    const id = req.params.id;
    const { room } = req.body;

    if (room) {
        if (room.optional) {
            if (
                typeof room.amount !== "number" ||
                typeof room.price !== "number" ||
                typeof room.area.width !== "number" ||
                typeof room.area.length !== "number" ||
                typeof room.total !== "number" ||
                typeof room.remain !== "number" ||
                typeof room.status !== "boolean"
            ) {
                await unlinkImageMotel(thumbnail, images);
                return res.status(400).json({
                    success: false,
                    message: "Thuộc tính phòng trọ bị sai",
                });
            }
        }
        for (let j = 0; j < room.length; j++) {
            let optional = {
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

            for (let i = 0; i < room[j].optional.length; i++) {
                optional[room[j].optional[i]] = true;
            }
            room[j].optional = optional;
        }
    }
    const motel = await motel.findById(id);
    if (motel) motel.room = room;
    else
        return res
            .status(400)
            .json({ success: false, message: "Không tồn tại nhà trọ" });
    if (req.user.isAdmin == true)
        try {
            await motel.save();
            res.status(200).json({ success: true, message: "Cập nhật thành công" });
        } catch {
            return res
                .status(500)
                .json({ success: false, message: "Lỗi không xác định" });
        }
});