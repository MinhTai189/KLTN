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

    let {
        _order,
        _sort,
        _keySearch,
        _limit,
        _page,
        _nameLike,
        _school,
        _district,
        _province,
        _role,
    } = req.query;
    let listUser;
    let totalRows;
    let keySearchs = [];
    if (_keySearch) {
        keySearchs = [
            ...keySearchs,
            { unsignedName: new RegExp(_keySearch, "i") },
            { unsignedName: new RegExp("^" + _keySearch, "i") },
            { unsignedName: new RegExp(_keySearch + "$", "i") },
            { school: new RegExp(_keySearch.replace(" ", "_"), "i") },
            {
                school: new RegExp("^" + _keySearch.replace(" ", "_"), "i"),
            },
            {
                school: new RegExp(_keySearch.replace(" ", "_") + "$", "i"),
            },
            { district: new RegExp(_keySearch.replace(" ", "_"), "i") },
            {
                district: new RegExp("^" + _keySearch.replace(" ", "_"), "i"),
            },
            {
                district: new RegExp(_keySearch.replace(" ", "_") + "$", "i"),
            },
            { province: new RegExp(_keySearch.replace(" ", "_"), "i") },
            {
                province: new RegExp("^" + _keySearch.replace(" ", "_"), "i"),
            },
            {
                province: new RegExp(_keySearch.replace(" ", "_") + "$", "i"),
            },
        ];
    } else {
        if (_nameLike)
            keySearchs = [
                ...keySearchs,
                { unsignedName: new RegExp(_nameLike, "i") },
                {
                    unsignedName: new RegExp("^" + _nameLike, "i"),
                },
                {
                    unsignedName: new RegExp(_nameLike + "$", "i"),
                },
            ];
    }

    if (keySearchs.length > 0) {
        listUser = await user
            .find({ $or: keySearchs })
            .select("-password")
            .select("-unsignedName");
    } else {
        listUser = await user.find({}).select("-password").select("-unsignedName");
    }

    if (_role) {
        if (_role === "user")
            listUser = listUser.filter((item) => {
                return item.isAdmin == false;
            });
        else if (_role === "admin")
            listUser = listUser.filter((item) => {
                return item.isAdmin == true;
            });
    }
    if (_school) listUser = listUser.filter((item) => item.school === _school);
    if (_district)
        listUser = listUser.filter((item) => item.district === _district);
    if (_province)
        listUser = listUser.filter((item) => item.province === _province);
    totalRows = listUser.length;
    if (_order && _sort)
        switch (_order) {
            case "createdAt":
                if (_sort === "asc")
                    listUser = listUser.sort(
                        (user1, user2) =>
                        new Date(user1.createdAt) - new Date(user2.createdAt)
                    );
                else if (_sort === "desc")
                    listUser = listUser.sort(
                        (user1, user2) =>
                        new Date(user2.createdAt) - new Date(user1.createdAt)
                    );
                break;
            case "credit":
                if (_sort === "asc")
                    listUser = listUser.sort(
                        (user1, user2) => user1.credit - user2.credit
                    );
                else if (_sort == "desc") {
                    listUser = listUser.sort(
                        (user1, user2) => user2.credit - user1.credit
                    );
                }
                break;
            default:
                break;
        }
    _page = parseInt(_page);
    _limit = parseInt(_limit);
    if (_page && _limit)
        listUser = listUser.slice(
            _limit * (_page - 1),
            _limit + _limit * (_page - 1)
        );
    if (_page && _limit)
        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: listUser,
            pagination: {
                _page: _page,
                _limit: _limit,
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