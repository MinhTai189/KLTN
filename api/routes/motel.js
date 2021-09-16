const express = require("express");
const router = express.Router();
const motel = require("../models/motel");
const user = require("../models/user");
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const unapprovedMotel = require("../models/unapproved-motel");
const upload = require("../middleware/upload");
router.delete("/:id", verifyToken, async(req, res) => {
    if (req.user.isAdmin != true)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });
    const checkMotel = await motel.findByIdAndDelete(id);
    if (!checkMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không có nhà trọ" });
    await unlinkImageMotel(thumbnail, images);
    return res.status(200).json({ success: true, message: "Đã xóa nhà trọ" });
});
router.get("/", async(req, res) => {
    let { _order, _sort, _keysearch, _limit, _page, _owner, _optional, _school } =
    req.query;
    const keySearchs = [
        { unsignedName: new RegExp(_keysearch, "i") },
        {
            unsignedName: new RegExp("^" + _keysearch, "i"),
        },
        {
            unsignedName: new RegExp(_keysearch + "$", "i"),
        },

        { address: new RegExp(_keysearch, "i") },
        {
            address: new RegExp("^" + _keysearch, "i"),
        },
        {
            address: new RegExp(_keysearch + "$", "i"),
        },
    ];
    if (_school) var _schools = _school.split(" ");
    if (_keysearch)
        if (_school)
            var listMotel = await motel
                .find({ $or: keySearchs, school: { $in: _schools } })
                .populate("school")
                .populate("owner", "name avatarUrl _id")
                .populate("editor", "name avatarUrl _id");
        else
            var listMotel = await motel
                .find({ $or: keySearchs })
                .populate("school")
                .populate("owner", "name avatarUrl _id")
                .populate("editor", "name avatarUrl _id");
    else {
        if (_school)
            var listMotel = await motel
                .find({ school: { $in: _schools } })
                .populate("school")
                .populate("owner", "name avatarUrl _id")
                .populate("editor", "name avatarUrl _id");
        else
            var listMotel = await motel
                .find({})
                .populate("school")
                .populate("owner", "name avatarUrl _id")
                .populate("editor", "name avatarUrl _id");
    }

    if (_owner)
        listMotel = listMotel.filter((item) => {
            item.owner._id === _owner;
        });
    if (_order && _sort)
        switch (_sort) {
            case "createdat":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) =>
                        new Date(motel1.createdAt) - new Date(motel2.createdAt)
                    );
                else if (_order === "desc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) =>
                        new Date(motel2.createdAt) - new Date(motel1.createdAt)
                    );
                break;
            case "price":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel1.price - motel2.price
                    );
                else if (_order == "desc") {
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel2.price - motel1.price
                    );
                }
                break;
            case "mark":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel1.mark - motel2.mark
                    );
                else if (_order == "desc") {
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel2.mark - motel1.mark
                    );
                }

                break;
            case "vote":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel1.vote - motel2.vote
                    );
                else if (_order == "desc") {
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel2.vote - motel1.vote
                    );
                }

                break;
            case "rate":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel1.rate.length - motel2.rate.length
                    );
                else if (_order == "desc") {
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel2.rate.length - motel1.rate.length
                    );
                }

                break;
            default:
                break;
        }
    if (_optional) {
        const _optionals = _optional.split(" ");

        listMotel = listMotel.filter((item) => {
            function filterRoomType(motel) {
                let bool = false;

                for (let j = 0; j < motel.room.length; j++) {
                    let count = 0;
                    for (let i = 0; i < _optionals.length; i++) {
                        if (motel.room[j].optional[_optionals[i]] == true) count++;
                    }
                    if (count == _optionals.length) {
                        bool = true;
                        break;
                    }
                }

                return bool;
            }

            return filterRoomType(item);
        });
    }
    const totalRows = listMotel.length;
    _page = parseInt(_page);
    _limit = parseInt(_limit);
    if (_page && _limit)
        listMotel = listMotel.slice(
            _limit * (_page - 1),
            _limit + _limit * (_page - 1)
        );
    let newData = [];
    for (let i = 0; i < listMotel.length; i++) {
        let ownerData;
        let editorData;
        let imagesUrl = [];
        if (listMotel[i].owner) {
            const avatarUrl = listMotel[i].owner.avatarUrl.url;
            ownerData = {
                avatarUrl,
                name: listMotel[i].owner.name,
                _id: listMotel[i].owner._id,
            };
        } else ownerData = null;
        if (listMotel[i].editor) {
            const avatarUrl = listMotel[i].editor.avatarUrl.url;
            editorData = {
                avatarUrl,
                name: listMotel[i].editor.name,
                _id: listMotel[i].editor._id,
            };
        } else editorData = null;
        let thumbnailUrl = listMotel[i].thumbnail.url;
        listMotel[i].images.forEach((image) => {
            imagesUrl.push(image.url);
        });
        newData.push({
            ...listMotel[i]._doc,
            owner: ownerData,
            editor: editorData,
            thumbnail: thumbnailUrl,
            images: imagesUrl,
        });
    }
    let page, limit;
    if (_page && _limit) page = _page;
    limit = _limit;
    return res.status(200).json({
        success: true,
        message: "Thành công",
        data: newData,
        pagination: { _page: page, _limit: limit, _totalRows: totalRows },
    });
});
const unlinkImageMotel = async(thumbnail, images) => {
    if (thumbnail != undefined) await upload.unlink(thumbnail.public_id);
    if (images != undefined)
        for (let i = 0; i < images.length; i++) {
            await upload.unlink(images[i].public_id);
        }
};
router.post("/", verifyToken, async(req, res) => {
    let {
        id,
        name,
        thumbnail,
        images,
        address,
        desc,
        room,
        contact,
        status,
        school,
        available,
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
            thumbnail: checkMotel.thumbnail,
            images: checkMotel.images,
            address: checkMotel.address,
            desc: checkMotel.desc,
            room: checkMotel.room,
            contact: checkMotel.contact,
            status: checkMotel.status,
            vote: checkMotel.vote,
            rate: checkMotel.rate,
            mark: checkMotel.mark,
            school: checkMotel.school,
            owner: checkMotel.owner,
            editor: checkMotel.editor,
            available: checkMotel.available,
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
    if (!thumbnail) {
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp ảnh tiêu đề" });
    }
    if (!name || name === "") {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp tên nhà trọ" });
    }
    if (!address || address === "") {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp địa chỉ nhà trọ" });
    }

    if (!desc) {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp một vài mô tả" });
    }

    if (!contact ||
        (!contact.phone && !contact.email && !contact.facbook && !contact.zalo)
    ) {
        await unlinkImageMotel(thumbnail, images);
        return res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp ít nhất một cách liên lạc nhà trọ",
        });
    }
    if (typeof status == "undefined") {
        await unlinkImageMotel(thumbnail, images);
        return res.status(400).json({
            success: false,
            message: "Vui lòng cho biết còn phòng trống hay không",
        });
    }
    if (!images) images = [];
    if (!room) {
        await unlinkImageMotel(thumbnail, images);
        return res.status(400).json({
            success: false,
            message: "Vui lòng cho biết ít nhất một loại phòng ở nhà trọ",
        });
    }
    if (room) {
        if (room.optional) {
            if (
                typeof room.optional.GIUONG !== "boolean" ||
                typeof room.optional.MAYLANH !== "boolean" ||
                typeof room.optional.QUAT !== "boolean" ||
                typeof room.optional.GAC !== "boolean" ||
                typeof room.optional.CHUNGCHU !== "boolean" ||
                typeof room.optional.LAU !== "boolean" ||
                typeof room.optional.GIUONGTANG !== "boolean" ||
                typeof room.optional.NHAXE !== "boolean" ||
                typeof room.optional.CAMERA !== "boolean" ||
                typeof room.optional.WIFI !== "boolean" ||
                typeof room.optional.DUNGCUVESINH !== "boolean" ||
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
    }
    const checkUserPost = await user.findById(req.user.id).select("credit");
    if (req.user.isAdmin == true || checkUserPost.credit >= 100) {
        const newMotel = new motel({
            name,
            unsignedName: removeVietNameseTones(name),
            thumbnail,
            images,
            address,
            desc,
            room,
            contact,
            status,
            vote: undefined,
            rate: [],
            mark: undefined,
            school,
            owner: req.user.id,
            editor: req.user.id,
            available,
        });
        try {
            const duplicateCheck = await check(newMotel.name, newMotel.school);
            const duplicateUnapprovedCheck = await checkUnapproved(
                newMotel.name,
                newMotel.school
            );
            if (duplicateCheck.dup == true) {
                if (req.user.isAdmin == true) {
                    await unlinkImageMotel(thumbnail, images);
                    return res.status(400).json({
                        success: false,
                        message: "Vui lòng xem xét lại, có vẻ đã tồn tại nhà trọ này rồi",
                        data: duplicateCheck.motel,
                    });
                }
            }
            const newMotelUnapproved = new unapprovedMotel({
                name,
                unsignedName: removeVietNameseTones(name),
                thumbnail,
                images,
                address,
                desc,
                room,
                contact,
                status,
                vote: undefined,
                rate: [],
                mark: undefined,
                school,
                owner: req.user.id,
                editor: req.user.id,
                available,
            });
            if (duplicateCheck.dup == true)
                newMotelUnapproved.duplicate = duplicateCheck.motel;
            if (duplicateUnapprovedCheck.dup == true)
                newMotelUnapproved.duplicateUnapproved = duplicateUnapprovedCheck.motel;
            if (duplicateCheck.dup == true || duplicateUnapprovedCheck == true) {
                await newMotelUnapproved.save();
                return res.status(200).json({
                    success: true,
                    message: "Thêm thành công, nhưng nhà trọ này dường như đã có từ trước, vui lòng chờ chúng tôi xem xét",
                });
            }
            await newMotel.save();
            return res.status(200).json({
                success: true,
                message: "Thêm thành công",
            });
        } catch (err) {
            console.log(err);
            await unlinkImageMotel(thumbnail, images);
            return res.status(500).json({
                success: false,
                message: "Vui lòng thử lại",
            });
        }
    } else {
        const newMotel = new unapprovedMotel({
            name,
            unsignedName: removeVietNameseTones(name),
            thumbnail,
            images,
            address,
            desc,
            room,
            contact,
            status,
            vote: undefined,
            rate: [],
            mark: undefined,
            school,
            owner: req.user.id,
            editor: req.user.id,
            available,
        });
        try {
            const duplicateCheck = await check(newMotel.name, newMotel.school);
            const duplicateUnapprovedCheck = await checkUnapproved(
                newMotel.name,
                newMotel.school
            );
            if (duplicateCheck.dup == true) newMotel.duplicate = duplicateCheck.motel;
            if (duplicateUnapprovedCheck.dup == true)
                newMotel.duplicateUnapproved = duplicateUnapprovedCheck.motel;
            if (duplicateCheck.dup == true || duplicateUnapprovedCheck.dup == true) {
                await newMotel.save();
                return res.status(200).json({
                    success: true,
                    message: "Thêm thành công, nhưng nhà trọ này dường như đã có từ trước, vui lòng chờ chúng tôi xem xét",
                });
            }
            await newMotel.save();
            return res.status(200).json({
                success: true,
                message: "Thêm thành công, vui lòng chờ duyệt",
            });
        } catch (err) {
            console.log(err);
            await unlinkImageMotel(thumbnail, images);
            return res.status(500).json({
                success: false,
                message: "Vui lòng thử lại",
            });
        }
    }
});
router.get("/:id", async(req, res) => {
    const id = req.params.id;
    const findMotel = await motel.findById(id);
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhà trọ này" });
    let images = [];
    findMotel.images.forEach((image) => {
        images.push(image.url);
    });
    const responseMotel = {
        ...findMotel,
        thumbnail: findMotel.thumbnail.url,
        images: images,
    };
    res
        .status(200)
        .json({ success: true, message: "Thành công", data: responseMotel });
});
const checkUnapproved = async(name, schools) => {
    const findMotel = await unapprovedMotel
        .find({
            $and: [{
                    $or: [{
                            unsignedName: new RegExp(
                                removeVietNameseTones(name).replace(/nha tro /g, ""),
                                "i"
                            ),
                        },

                        { unsignedName: new RegExp(removeVietNameseTones(name), "i") },
                    ],
                },
                { $in: { school: schools } },
            ],
        })
        .select("_id");
    let d = [];
    findMotel.forEach((item) => {
        d.push(item._id);
    });
    if (findMotel.length > 0) return { dup: true, motel: d };
    else return { dup: false };
};
const check = async(name, schools) => {
    const findMotel = await motel
        .find({
            $and: [{
                    $or: [{
                            unsignedName: new RegExp(
                                removeVietNameseTones(name).replace(/nha tro /g, ""),
                                "i"
                            ),
                        },

                        { unsignedName: new RegExp(removeVietNameseTones(name), "i") },
                    ],
                },
                { $in: { school: schools } },
            ],
        })
        .select("_id");
    let d = [];
    findMotel.forEach((item) => {
        d.push(item._id);
    });
    if (findMotel.length > 0) return { dup: true, motel: d };
    else return { dup: false };
};
module.exports = router;