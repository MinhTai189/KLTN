const express = require("express");
const router = express.Router();
const motel = require("../models/motel");
const user = require("../models/user");
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const unapprovedMotel = require("../models/unapproved-motel");
const { assign } = require("nodemailer/lib/shared");

router.get("/", async (req, res) => {
    let { _order, _sort, _keysearch, _limit, _page, _owner } = req.query;
    let totalRows = 0;

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
    if (_keysearch)
        var listMotel = await motel
            .find({ $or: keySearchs })
            .populate("owner", "name avatarUrl _id")
            .populate("editor", "name avatarUrl _id");
    else
        var listMotel = await motel
            .find({})
            .populate("owner")
            .populate("owner", "name avatarUrl _id")
            .populate("editor", "name avatarUrl _id");

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

    totalRows = listMotel.length

    if (_page && _limit) {
        _page = parseInt(_page);
        _limit = parseInt(_limit);

        listMotel = listMotel.slice(
            _limit * (_page - 1),
            _limit + _limit * (_page - 1)
        );
    } else {
        _page = 1;
        _limit = listMotel.length
    }

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



    return res.status(200).json({
        success: true,
        message: "Thành công",
        data: newData,
        pagination: { _page, _limit, _totalRows: totalRows },
    });
});

router.post("/", verifyToken, async (req, res) => {
    let {
        id,
        name,
        thumbnail,
        images,
        address,
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
            thumbnail: checkMotel.thumbnail,
            images: checkMotel.images,
            address: checkMotel.address,
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
    if (!thumbnail)
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp ảnh tiêu đề" });
    if (!name || name === "")
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp tên nhà trọ" });
    if (!address || address === "")
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
    if (!images) images = [];
    const checkUserPost = await user.findById(req.user.id).select("credit");
    if (req.user.isAdmin == true || checkUserPost.credit >= 100) {
        const newMotel = new motel({
            name,
            unsignedName: removeVietNameseTones(name),
            thumbnail,
            images,
            address,
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
            thumbnail,
            images,
            address,
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
module.exports = router;