const express = require("express");
const router = express.Router();
const user = require("../models/user");

const argon2 = require("argon2");
const verifyToken = require("../methods/verifyToken");

router.get("/users", verifyToken, async(req, res) => {
    if (!req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    const {
        order,
        sort,
        keySearch,
        limit,
        page,
        nameLike,
        schoolLike,
        districtLike,
        provinceLike,
    } = req.query;
    // sap xep ngày tham gia moi nhat, cu nhat ; diem uy tin thap nhat , cao nhat
    /* query
                                                                    order: createAt, credit
                                                                    sort: tang dan, giam dan
                                                                                keySearch: tu khoa tim kiem 
                                                                                namelike
                                                                                school
                                                                                district 
                                                                                province
                                                                             \*/
    const keySearchs = [];

    let listUser;
    if (keySearch) {
        keySearchs = [
            ...keySearchs,
            { unsignedName: new RegExp(keySearch, "i") },
            { unsignedName: new RegExp("^" + keySearch, "i") },
            { unsignedName: new RegExp(keySearch + "$", "i") },
            { school: new RegExp(schoolLike.replace(" ", "_"), "i") },
            {
                school: new RegExp("^" + schoolLike.replace(" ", "_"), "i"),
            },
            {
                school: new RegExp(schoolLike.replace(" ", "_") + "$", "i"),
            },
            { district: new RegExp(districtLike.replace(" ", "_"), "i") },
            {
                district: new RegExp("^" + districtLike.replace(" ", "_"), "i"),
            },
            {
                district: new RegExp(districtLike.replace(" ", "_") + "$", "i"),
            },
            { province: new RegExp(provinceLike.replace(" ", "_"), "i") },
            {
                province: new RegExp("^" + provinceLike.replace(" ", "_"), "i"),
            },
            {
                province: new RegExp(provinceLike.replace(" ", "_") + "$", "i"),
            },
        ];
    } else {
        if (nameLike)
            keySearchs = [
                ...keySearchs,
                { name: new RegExp(nameLike.replace(" ", "_"), "i") },
                {
                    name: new RegExp("^" + nameLike.replace(" ", "_"), "i"),
                },
                {
                    name: new RegExp(nameLike.replace(" ", "_") + "$", "i"),
                },
            ];
        if (schoolLike)
            keySearchs = [
                ...keySearchs,
                { school: new RegExp(schoolLike.replace(" ", "_"), "i") },
                {
                    school: new RegExp("^" + schoolLike.replace(" ", "_"), "i"),
                },
                {
                    school: new RegExp(schoolLike.replace(" ", "_") + "$", "i"),
                },
            ];
        if (districtLike)
            keySearchs = [
                ...keySearchs,
                { district: new RegExp(districtLike.replace(" ", "_"), "i") },
                {
                    district: new RegExp("^" + districtLike.replace(" ", "_"), "i"),
                },
                {
                    district: new RegExp(districtLike.replace(" ", "_") + "$", "i"),
                },
            ];
        if (provinceLike)
            keySearchs = [
                ...keySearchs,
                { province: new RegExp(provinceLike.replace(" ", "_"), "i") },
                {
                    province: new RegExp("^" + provinceLike.replace(" ", "_"), "i"),
                },
                {
                    province: new RegExp(provinceLike.replace(" ", "_") + "$", "i"),
                },
            ];
    }

    switch (order) {
        case "createAt":
            listUser = await user
                .find({ $or: keySearchs })
                .sort({ createdAt: sort })
                .limit(parseInt(limit))
                .skip(limit * (page - 1));

            break;
        case "credit":
            listUser = await user
                .find({ $or: keySearchs })
                .sort({ credit: sort })
                .limit(parseInt(limit))
                .skip(limit * (page - 1));

            break;
        default:
            break;
    }

    res.status(200).json({
        success: true,
        message: "thanh cong",
        data: {
            listUser,
        },
    });
});
router.put("/user/:id", verifyToken, async(req, res) => {
    const id = req.params.id;
    if (req.user.id !== id || !req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });
    const checkUser = await user.findById(id);

    if (!checkUser)
        return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy người dùng" });
    if (req.body.password && req.body.newPassword) {
        const isMatch = await argon2.verify(checkUser.password, req.body.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Sai mật khẩu cũ" });
        req.body.newPassword = await argon2.hash(req.body.newPassword);
    }
    try {
        await user.findByIdAndUpdate(id, { $set: req.body });
        res.status(200).json({ success: true, message: "User has been updated" });
    } catch (err) {
        res.status(400);
    }
});
router.delete("/user/:id", verifyToken, async(req, res) => {
    const id = req.params.id;
    if (req.user.id !== id || !req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    try {
        const userDelete = await user.findByIdAndDelete(id);
        if (!userDelete)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy người dùng" });
        res.status(200).json({ success: false, message: "Đã xóa người dùng" });
    } catch {
        res.status(422).json({ success: false, message: "Vui lòng thử lại" });
    }
});

module.exports = router;