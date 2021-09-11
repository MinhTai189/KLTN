const express = require("express");
const router = express.Router();
const user = require("../models/user");
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");


router.get("/users", verifyToken, async (req, res) => {
    if (!req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    let {
        _order,
        _sort,
        _keysearch,
        _limit,
        _page,
        _namelike,
        _school,
        _district,
        _province,
        _role,
    } = req.query;

    let listUser;
    let totalRows;
    let keySearchs = [];
    if (_keysearch) {
        //_keysearch = removeVietNameseTones(_keysearch);
        keySearchs = [
            ...keySearchs,
            { unsignedName: new RegExp(_keysearch, "i") },
            {
                unsignedName: new RegExp("^" + _keysearch, "i"),
            },
            {
                unsignedName: new RegExp(_keysearch + "$", "i"),
            },
            { school: new RegExp(_keysearch.replace(/ /g, "_"), "i") },
            {
                school: new RegExp("^" + _keysearch.replace(/ /g, "_"), "i"),
            },
            {
                school: new RegExp(_keysearch.replace(/ /g, "_") + "$", "i"),
            },
            { district: new RegExp(_keysearch.replace(/ /g, "_"), "i") },
            {
                district: new RegExp("^" + _keysearch.replace(/ /g, "_"), "i"),
            },
            {
                district: new RegExp(_keysearch.replace(/ /g, "_") + "$", "i"),
            },
            { province: new RegExp(_keysearch.replace(/ /g, "_"), "i") },
            {
                province: new RegExp("^" + _keysearch.replace(/ /g, "_"), "i"),
            },
            {
                province: new RegExp(_keysearch.replace(/ /g, "_") + "$", "i"),
            },
            { email: new RegExp(_keysearch.replace(/ /g, "_"), "i") },
            {
                email: new RegExp("^" + _keysearch.replace(/ /g, "_"), "i"),
            },
            {
                email: new RegExp(_keysearch.replace(/ /g, "_") + "$", "i"),
            },
            { username: new RegExp(_keysearch.replace(/ /g, "_"), "i") },
            {
                username: new RegExp("^" + _keysearch.replace(/ /g, "_"), "i"),
            },
            {
                username: new RegExp(_keysearch.replace(/ /g, "_") + "$", "i"),
            },
        ];
    } else {
        if (_namelike)
            keySearchs = [
                ...keySearchs,
                { unsignedName: new RegExp(_namelike, "i") },
                {
                    unsignedName: new RegExp("^" + _namelike, "i"),
                },
                {
                    unsignedName: new RegExp(_namelike + "$", "i"),
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
        switch (_sort) {
            case "createdat":
                if (_order === "asc")
                    listUser = listUser.sort(
                        (user1, user2) =>
                            new Date(user1.createdAt) - new Date(user2.createdAt)
                    );
                else if (_order === "desc")
                    listUser = listUser.sort(
                        (user1, user2) =>
                            new Date(user2.createdAt) - new Date(user1.createdAt)
                    );
                break;
            case "credit":
                if (_order === "asc")
                    listUser = listUser.sort(
                        (user1, user2) => user1.credit - user2.credit
                    );
                else if (_order == "desc") {
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
            pagination: {
                _page: _page,
                _limit: totalRows,
                _totalRows: totalRows,
            },
        });
});

router.patch("/users/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    if (req.user.id !== id && !req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    const checkUser = await user.findById(id);

    if (!checkUser)
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy tài khoản cần cập nhật!",
        });
    if (req.user.id === id && !req.user.isAdmin) {
        if (req.body.password) {
            if (!req.body.newPassword)
                return res
                    .status(400)
                    .json({ success: false, message: "Hãy nhập đầy đủ thông tin!" });
            const isMatch = await argon2.verify(
                checkUser.password,
                req.body.password
            );
            if (!isMatch)
                return res.status(400).json({
                    success: false,
                    message: "Mật khẩu cũ không chính xác. Hãy kiểm tra lại!",
                });
            req.body.password = await argon2.hash(req.body.newPassword);

            await user.findByIdAndUpdate(id, { password: req.body.password });
            return res
                .status(200)
                .json({ success: true, message: "Đã thay đổi mật khẩu thành công!" });
        } else {
            newDataUser = {};
            const { name, school, district, province, results } = req.body;
            if (!name &&
                typeof results === "undefined" &&
                !school &&
                !district &&
                !province
            )
                return res.status(400).json({
                    success: true,
                    message: "Hãy điền đầy đủ thông tin cần cập nhật!",
                });

            if (name) {
                newDataUser.name = name;
                newDataUser.unsignedName = removeVietNameseTones(name);
            }
            if (results) {
                if (results.length == 1) {
                    const avatarUrl = {
                        url: results[0].url,
                        public_id: results[0].public_id,
                    };
                    newDataUser.avatarUrl = avatarUrl;
                }
            }
            if (school) newDataUser.school = school;
            if (district) newDataUser.district = district;
            if (province) newDataUser.province = province;
            const userUpdate = await user.findByIdAndUpdate(id, {
                $set: newDataUser,
            });
            if (userUpdate) {
                if (
                    typeof newDataUser.avatarUrl !== "undefined" &&
                    typeof checkUser.avatarUrl.public_id !== "undefined"
                ) {
                    await upload.unlink(checkUser.avatarUrl.public_id);
                }
                return res.status(200).json({
                    success: true,
                    message: "Đã cập nhật thông tin",
                    data: userUpdate,
                });
            }
        }
    } else if (req.user.isAdmin)
        try {
            newDataUser = {};

            const { name, school, district, province, isAdmin, email, credit } =
                req.body;

            if (
                typeof results === "undefined" &&
                !name &&
                !school &&
                !district &&
                !province &&
                !email &&
                !results &&
                typeof credit === "undefined" &&
                typeof isAdmin === "undefined"
            )
                return res.status(400).json({
                    success: false,
                    message: "Hãy điền đầy đủ thông tin cần cập nhật!",
                });
            if (name) {
                newDataUser.name = name;
                newDataUser.unsignedName = removeVietNameseTones(name);
            }
            if (results) {
                if (results.length > 0) {
                    const avatarUrl = {
                        url: results[0].url,
                        public_id: results[0].public_id,
                    };
                    newDataUser.avatarUrl = avatarUrl;
                }
            }
            if (school) newDataUser.school = school;
            if (district) newDataUser.district = district;
            if (province) newDataUser.province = province;
            if (typeof isAdmin !== "undefined") newDataUser.isAdmin = isAdmin;
            if (email) newDataUser.email = email;
            if (credit >= 0 && typeof credit === "number")
                newDataUser.credit = credit;

            const userUpdated = await user.findByIdAndUpdate(id, {
                $set: newDataUser,
            });

            if (userUpdated) {
                if (
                    typeof newDataUser.avatarUrl !== "undefined" &&
                    typeof checkUser.avatarUrl.public_id !== "undefined"
                ) {
                    await upload.unlink(checkUser.avatarUrl.public_id);
                }
                res.status(200).json({
                    success: true,
                    message: "Đã cập nhật thông tin tài khoản!",
                    data: userUpdated,
                });
            }
        } catch (err) {
            res.status(500);
        }
});

router.delete("/users/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    if (req.user.id !== id && !req.user.isAdmin)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    try {
        const userDelete = await user.findByIdAndDelete(id);
        if (!userDelete)
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy người dùng" });
        if (userDelete.avatarUrl.public_id) {
            const unlinkFile = await upload.unlink(userDelete.avatarUrl.public_id);
            if (unlinkFile.success)
                return res
                    .status(200)
                    .json({ success: false, message: "Đã xóa người dùng" });
        }
    } catch {
        res.status(422).json({ success: false, message: "Vui lòng thử lại" });
    }
});

module.exports = router;