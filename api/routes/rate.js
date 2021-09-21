const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const router = express.Router();

router.post("/:id", verifyToken, async(req, res) => {
    let { content, star } = req.body;
    const findMotel = await motel.findById(req.params.id);
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhà trọ" });
    else {
        try {
            await motel.findByIdAndUpdate(req.params.id, {
                $push: {
                    rate: { content, star, createAt: undefined, user: req.user.id },
                },
                vote: findMotel.vote + star,
                mark: (findMotel.vote + star) / (findMotel.rate.length + 1),
            });
            res.status(200).json({
                success: true,
                message: "Đánh giá thành công, xin cảm ơn bạn đã góp ý",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "Lỗi",
            });
        }
    }
});
router.delete("/:id/:idRate", verifyToken, async(req, res) => {
    const id = req.params.id;
    const idRate = req.params.idRate;
    const findMotel = await motel.findById(id);
    if (findMotel) {
        const rate = findMotel.rate.find(
            (item) => JSON.stringify(idRate) === JSON.stringify(item._id)
        );
        if (!rate)
            return res
                .status(400)
                .json({ success: false, message: "Không tìm thấy đánh giá" });
        if (
            req.user.isAdmin == true ||
            JSON.stringify(req.user.id) === JSON.stringify(rate.user)
        )
            try {
                await motel.findOneAndUpdate({ _id: id }, {
                    $pull: { rate: { _id: idRate } },
                    vote: findMotel.vote - rate.star,
                    mark: (findMotel.vote - rate.star) / (findMotel.rate.length - 1),
                });
                return res
                    .status(200)
                    .json({ success: true, message: "Đã xóa thành công" });
            } catch (err) {
                console.log(err);
                return res
                    .status(500)
                    .json({ success: false, message: "Lỗi không xác định" });
            }
        else
            return res
                .status(405)
                .json({ success: false, message: "Bạn không có quyền" });
    } else
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhà trọ" });
});
router.patch("/:id/:idRate", verifyToken, async(req, res) => {
    const id = req.params.id;
    const idRate = req.params.idRate;
    const findMotel = await motel.findById(id);
    const rate = findMotel.rate.find(
        (item) => JSON.stringify(idRate) === JSON.stringify(item._id)
    );
    if (!rate)
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy đánh giá" });
    if (JSON.stringify(req.user.id) !== JSON.stringify(rate.user))
        return res
            .status(405)
            .json({ success: false, message: "Bạn không có quyền chỉnh sửa" });
    const { content, star } = req.body;
    await motel.findOneAndUpdate({ _id: id, "rate._id": idRate }, {
        $set: { "rate.$.content": content, "rate.$.star": star },
        vote: findMotel.vote - rate.star + star,
        mark: (findMotel.vote - rate.star + star) / findMotel.rate.length,
    });
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhà trọ" });
    else return res.status(200).json({ success: true, message: "Thành công" });
});
module.exports = router;