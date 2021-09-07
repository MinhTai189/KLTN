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
    let listUser;
    let totalRows;
    let keySearchs = [];
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
                { unsignedName: new RegExp(nameLike, "i") },
                {
                    unsignedName: new RegExp("^" + nameLike, "i"),
                },
                {
                    unsignedName: new RegExp(nameLike + "$", "i"),
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
    console.log(keySearchs);
    if (keySearchs.length > 0) {
        totalRows = await user.countDocuments({ $or: keySearchs });
        listUser = await user.find({ $or: keySearchs }).select("-password");
    } else {
        totalRows = await user.countDocuments({});
        listUser = await user.find({}).select("-password");
    }
    if (order && sort)
        switch (order) {
            case "createdAt":
                if (sort === "asc")
                    listUser = await listUser.sort(
                        (user1, user2) =>
                        new Date(user1.createdAt) - new Date(user2.createdAt)
                    );
                else if (sort === "desc")
                    listUser = await listUser.sort(
                        (user1, user2) =>
                        new Date(user2.createdAt) - new Date(user1.createdAt)
                    );
                break;
            case "credit":
                if (sort === "asc")
                    listUser = await listUser.sort(
                        (user1, user2) => user1.credit - user2.credit
                    );
                else if (sort == "desc") {
                    listUser = await listUser.sort(
                        (user1, user2) => user2.credit - user1.credit
                    );
                }
                break;
            default:
                break;
        }
    if (page && limit)
        listUser = await listUser.slice(
            limit * (page - 1),
            limit + limit * (page - 1)
        );
    if (page && limit)
        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: listUser,
            pagination: {
                _page: page,
                _limit: limit,
                _totalRows: totalRows,
            },
        });
    else
        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: listUser,
            totalRows: totalRows,
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
    if (req.body.password) {
        if (!req.body.newPassword)
            return res
                .status(401)
                .json({ success: false, message: "Không có mật khẩu mới" });
        const isMatch = await argon2.verify(checkUser.password, req.body.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Sai mật khẩu cũ" });
        req.body.password = await argon2.hash(req.body.newPassword);
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