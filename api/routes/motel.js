const express = require("express");
const router = express.Router();
const school = require("../models/school");
const motel = require("../models/motel");
const user = require("../models/user");
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const unapprovedMotel = require("../models/unapproved-motel");
const upload = require("../middleware/upload");
const shuffle = require("../middleware/shuffle");
router.get("/randoms", async(req, res) => {
    let listMotel = await motel
        .find({})
        .populate("school", "-nameDistricts")
        .populate("rate.user", "-refreshToken")
        .populate("owner", "name avatarUrl _id isAdmin")
        .populate("editor.user", "name avatarUrl _id isAdmin");
    listMotel = shuffle(listMotel);

    if (req.query._limit)
        if (!isNaN(parseInt(req.query._limit)))
            listMotel = listMotel.slice(0, parseInt(req.query._limit));
    let newData = [];

    for (let i = 0; i < listMotel.length; i++) {
        let rateData = [];
        let ownerData;
        let editorData = [];
        let imagesUrl = [];
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
        for (let j = 0; j < listMotel[i].room.length; j++)
            for (const property in listMotel[i].room[j].optional) {
                if (listMotel[i].room[j].optional[property] == true)
                    optional[property] = true;
            }

        for (let j = 0; j < listMotel[i].rate.length; j++) {
            const userNewData = {
                _id: listMotel[i].rate[j].user._id,
                name: listMotel[i].rate[j].user.name,
                avatarUrl: listMotel[i].rate[j].user.avatarUrl.url,
                credit: listMotel[i].rate[j].user.credit,
                isAdmin: listMotel[i].rate[j].user.isAdmin,
            };
            rateData.push({...listMotel[i].rate[j]._doc, user: userNewData });
        }
        if (listMotel[i].owner) {
            const avatarUrl = listMotel[i].owner.avatarUrl.url;
            ownerData = {
                avatarUrl,
                name: listMotel[i].owner.name,
                _id: listMotel[i].owner._id,
                isAdmin: listMotel[i].owner.isAdmin,
            };
        } else ownerData = null;
        if (Array.isArray(listMotel[i].editor)) {
            for (let j = 0; j < listMotel[i].editor.length; j++) {
                let editorDataUser;
                const avatarUrl = listMotel[i].editor[j].user.avatarUrl.url;
                editorDataUser = {
                    avatarUrl,
                    name: listMotel[i].editor[j].user.name,
                    _id: listMotel[i].editor[j].user._id,
                    isAdmin: listMotel[i].editor[j].user.isAdmin,
                };
                editorData.push({
                    user: editorDataUser,
                    edited: listMotel[i].editor[j].edited,
                    createdAt: listMotel[i].editor[j].createdAt,
                });
            }
        }
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
            rate: rateData,
            optional,
        });
    }
    res.status(200).json({ success: true, message: "Thành Công", data: newData });
});

router.patch("/:id", verifyToken, async(req, res) => {
    const motelUpdate = await motel.findById(req.params.id).select("-room -rate");
    if (!motelUpdate)
        return res
            .status(404)
            .json({ success: true, message: "Không tìm thấy nhà trọ" });

    let {
        name,
        thumbnail,
        images,
        address,
        desc,
        contact,
        status,
        school,
        available,
    } = req.body;
    if (!name &&
        !thumbnail &&
        !images &&
        !address &&
        !desc &&
        !contact &&
        typeof status === "undefined" &&
        !school &&
        !available
    )
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy dữ liệu cần cập nhật" });
    let edited = "Chỉnh sửa nhà trọ: ";
    if (typeof name === "string")
        if (motelUpdate.name != name) edited += "tên nhà trọ";

    if (thumbnail.public_id)
        if (thumbnail.url != motelUpdate.thumbnail.url)
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "ảnh bìa";
            else edited += ", ảnh bìa";
    if (typeof address === "string")
        if (address != motelUpdate.address)
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "địa chỉ";
            else edited += ", địa chỉ";
    if (typeof desc === "string")
        if (desc != motelUpdate.desc)
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "giới thiệu";
            else edited += ", giới thiệu";
    if (contact)
        if (
            typeof contact.phone === "string" ||
            typeof contact.zalo === "string" ||
            typeof contact.email === "string" ||
            typeof contact.facebook === "string"
        )
            if (
                motelUpdate.contact.zalo != contact.zalo ||
                motelUpdate.contact.phone != contact.phone ||
                motelUpdate.contact.facebook != contact.facebook ||
                motelUpdate.contact.email != contact.email
            )
                if (edited === "Chỉnh sửa nhà trọ: ") edited += "thông tin liên hệ";
                else edited += ", thông tin liên hệ";
    if (typeof status === "boolean")
        if (motelUpdate.status != status)
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "trang thái";
            else edited += ", trạng thái";
    if (typeof available === "number")
        if (available != motelUpdate.available)
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "phòng trống";
            else edited += ", phòng trống";

    if (Array.isArray(school))
        for (let i = 0; i < school.length; i++) {
            if (!motelUpdate.school.some((item) => {
                    JSON.stringify(item) === JSON.stringify(school[i]._id);
                })) {
                if (edited === "Chỉnh sửa nhà trọ: ") edited += "lân cận";
                else edited += ", lân cận";
                break;
            }
        }

    if (name) {
        if (typeof name === "string") {
            motelUpdate.name = name;
            motelUpdate.unsignedName = removeVietNameseTones(name);
        }
    }

    const oldThumbnail = motelUpdate.thumbnail.public_id;

    if (thumbnail)
        if (typeof thumbnail === "object") {
            motelUpdate.thumbnail = thumbnail;
        }
    if (address)
        if (typeof address === "string") {
            motelUpdate.address = address;
        }
    if (desc)
        if (typeof desc === "string") motelUpdate.desc = desc;
    if (contact)
        if (
            typeof contact.phone === "string" ||
            typeof contact.zalo === "string" ||
            typeof contact.email === "string" ||
            typeof contact.facebook === "string"
        ) {
            motelUpdate.contact = contact;
        }
    if (typeof status === "boolean") {
        motelUpdate.status = status;
    }
    if (Array.isArray(school) == true) {
        motelUpdate.school = school;
    }
    if (typeof available === "number") {
        motelUpdate.available = available;
    }
    let oldImages = motelUpdate.images;
    let newImage = [];
    let oldImage = [];

    if (Array.isArray(images) == true) {
        for (let i = 0; i < images.length; i++) {
            typeof images[i] === "string" ?
                oldImage.push(images[i]) :
                newImage.push(images[i]);
        }
    }
    if (newImage.length > 0)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "hình ảnh";
        else edited += ", hình ảnh";
    if (req.user.isAdmin == true) {
        try {
            if (motelUpdate.editor.length >= 3) motelUpdate.editor.shift();
            motelUpdate.editor.push({
                user: req.user.id,
                edited: edited,
                createdAt: Date.now(),
            });
            if (thumbnail)
                if (typeof thumbnail === "object") await upload.unlink(oldThumbnail);

            if (Array.isArray(images))
                var removeImages = oldImages.reduce((arr, image) => {
                    if (!oldImage.includes(image.url)) arr.push(image);
                    return arr;
                }, []);

            for (let i = 0; i < removeImages.length; i++) {
                await upload.unlink(removeImages[i].public_id);
            }

            oldImages = oldImages.filter((image) => {
                let result = true;
                removeImages.forEach((remove) => {
                    if (remove.url === image.url) {
                        result = false;
                        return;
                    }
                });
                return result;
            });
            oldImages = [...oldImages, ...newImage];
            motelUpdate.images = oldImages;
            await motelUpdate.save();
            res
                .status(200)
                .json({ success: true, message: "Đã cập nhật thành công" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Lỗi khong xác định" });
        }
    }
});

router.get("/schools", async(req, res) => {
    const { _nameLike } = req.query;
    if (_nameLike)
        var keySearchs = [
            { codeName: new RegExp(_nameLike.replace(/ /g, "_"), "i") },
            {
                codeName: new RegExp("^" + _nameLike.replace(/ /g, "_"), "i"),
            },
            {
                codeName: new RegExp(_nameLike.replace(/ /g, "_") + "$", "i"),
            },
        ];
    if (_nameLike) var schools = await school.find({ $or: keySearchs });
    else var schools = await school.find({});
    const motels = await motel.find({}).select("_id thumbnail school");
    let data = [];
    for (let i = 0; i < schools.length; i++) {
        const getMotelOfSchool = motels.filter((item) => {
            const condition = (motel) => {
                let bool = false;

                motel.school.forEach((s) => {
                    if (JSON.stringify(s) === JSON.stringify(schools[i]._id)) {
                        bool = true;
                        return;
                    }
                });
                return bool;
            };
            return condition(item);
        });

        let motelsData = [];
        for (let j = 0; j < getMotelOfSchool.length; j++) {
            const thumbnail = getMotelOfSchool[j].thumbnail.url;
            motelsData.push({ thumbnail: thumbnail, _id: motels[j]._id });
        }
        data.push({
            motels: motelsData,
            district: schools[i].nameDistricts,
            _id: schools[i]._id,
            name: schools[i].name,
            codeName: schools[i].codeName,
        });
    }
    res.status(200).json({ success: true, message: "Thành công", data: data });
});

router.delete("/:id", verifyToken, async(req, res) => {
    if (!req.params.id)
        return res
            .status(400)
            .json({ success: false, message: "Không có thông tin" });
    const id = req.params.id;
    if (req.user.isAdmin != true)
        return res
            .status(405)
            .json({ success: false, message: "Không đủ quyền hạn truy cập" });
    const checkMotel = await motel.findByIdAndDelete(id);
    if (!checkMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không có nhà trọ" });
    const deleteMotelImage = await unlinkImageMotel(
        checkMotel.thumbnail,
        checkMotel.images
    );
    console.log(deleteMotelImage);
    return res.status(200).json({ success: true, message: "Đã xóa nhà trọ" });
});

router.get("/", async(req, res) => {
    let {
        _order,
        _sort,
        _keysearch,
        _limit,
        _page,
        _owner,
        _optional,
        _school,
        _status,
    } = req.query;
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
                .populate("school", "-nameDistricts")
                .populate("rate.user", "-refreshToken")
                .populate("owner", "name avatarUrl _id isAdmin")
                .populate("editor.user", "name avatarUrl _id isAdmin");
        else
            var listMotel = await motel
                .find({ $or: keySearchs })
                .populate("school", "-nameDistricts")
                .populate("rate.user", "-refreshToken")
                .populate("owner", "name avatarUrl _id isAdmin")
                .populate("editor.user", "name avatarUrl _id isAdmin");
    else {
        if (_school)
            var listMotel = await motel
                .find({ school: { $in: _schools } })
                .populate("school", "-nameDistricts")
                .populate("rate.user", "-refreshToken")
                .populate("owner", "name avatarUrl _id isAdmin")
                .populate("editor.user", "name avatarUrl _id isAdmin");
        else
            var listMotel = await motel
                .find({})
                .populate("school", "-nameDistricts")
                .populate("rate.user", "-refreshToken")
                .populate("owner", "name avatarUrl _id isAdmin")
                .populate("editor.user", "name avatarUrl _id isAdmin");
    }
    if (_keysearch) {
        const addMotelUser = await user
            .find({
                $or: [
                    { unsignedName: new RegExp(_keysearch, "i") },
                    {
                        unsignedName: new RegExp("^" + _keysearch, "i"),
                    },
                    {
                        unsignedName: new RegExp(_keysearch + "$", "i"),
                    },
                ],
            })
            .select("_id");
        let addMotelUser2 = await motel
            .find({})
            .populate("school", "-nameDistricts")
            .populate("rate.user", "-refreshToken")
            .populate("owner", "name avatarUrl _id isAdmin")
            .populate("editor.user", "name avatarUrl _id isAdmin");
        addMotelUser.forEach((item) => {
            addMotelUser2.forEach((item2) => {
                if (JSON.stringify(item._id) === JSON.stringify(item2.owner._id)) {
                    if (
                        listMotel.some((motel) => {
                            JSON.stringify(motel.owner._id) === JSON.stringify(item._id);
                        })
                    ) {} else {
                        listMotel.push(item2);
                    }
                }
            });
        });
    }

    if (
        _status &&
        (_status.toLowerCase() === "true" || _status.toLowerCase() === "false")
    ) {
        listMotel = listMotel.filter((item) => {
            return String(item.status) == _status.toLowerCase();
        });
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
            case "room":
                if (_order === "asc")
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel1.room.length - motel2.room.length
                    );
                else if (_order == "desc") {
                    listMotel = listMotel.sort(
                        (motel1, motel2) => motel2.room.length - motel1.room.length
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
        let rateData = [];
        let ownerData;
        let editorData = [];
        let imagesUrl = [];
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
        for (let j = 0; j < listMotel[i].room.length; j++)
            for (const property in listMotel[i].room[j].optional) {
                if (listMotel[i].room[j].optional[property] == true)
                    optional[property] = true;
            }
        for (let j = 0; j < listMotel[i].rate.length; j++) {
            const userNewData = {
                _id: listMotel[i].rate[j].user._id,
                name: listMotel[i].rate[j].user.name,
                avatarUrl: listMotel[i].rate[j].user.avatarUrl.url,
                credit: listMotel[i].rate[j].user.credit,
                isAdmin: listMotel[i].rate[j].user.isAdmin,
            };
            rateData.push({...listMotel[i].rate[j]._doc, user: userNewData });
        }
        if (listMotel[i].owner) {
            const avatarUrl = listMotel[i].owner.avatarUrl.url;
            ownerData = {
                avatarUrl,
                name: listMotel[i].owner.name,
                _id: listMotel[i].owner._id,
                isAdmin: listMotel[i].owner.isAdmin,
            };
        } else ownerData = null;
        if (Array.isArray(listMotel[i].editor)) {
            for (let j = 0; j < listMotel[i].editor.length; j++) {
                let editorDataUser;
                const avatarUrl = listMotel[i].editor[j].user.avatarUrl.url;
                editorDataUser = {
                    avatarUrl,
                    name: listMotel[i].editor[j].user.name,
                    _id: listMotel[i].editor[j].user._id,
                    isAdmin: listMotel[i].editor[j].user.isAdmin,
                };
                editorData.push({
                    user: editorDataUser,
                    edited: listMotel[i].editor[j].edited,
                    createdAt: listMotel[i].editor[j].createdAt,
                });
            }
        }
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
            rate: rateData,
            optional,
        });
    }
    let page = 1,
        limit = totalRows;
    if (_page && _limit) {
        page = _page;
        limit = _limit;
    }

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
            images: [],
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
            editor: [],
            available: checkMotel.available,
        });
        try {
            for (let i = 0; i < checkMotel.images.length; i++) {
                const renameImage = await upload.rename(
                    checkMotel.images[i].public_id,
                    newMotel._id +
                    "/" +
                    checkMotel.images[i].public_id.substr(
                        checkMotel.images[i].public_id.indexOf("/") + 1
                    )
                );
                if (renameImage.success)
                    newMotel.images.push({
                        public_id: renameImage.data.public_id,
                        url: renameImage.data.url,
                    });
                else {
                    return res.status(400).json({ message: "Lỗi hình", success: false });
                }
            }
            const renameThumbnail = await upload.rename(
                checkMotel.thumbnail.public_id,
                newMotel._id +
                "/" +
                checkMotel.thumbnail.public_id.substr(
                    checkMotel.thumbnail.public_id.indexOf("/") + 1
                )
            );
            if (renameThumbnail.success)
                newMotel.thumbnail = {
                    public_id: renameThumbnail.data.public_id,
                    url: renameThumbnail.data.url,
                };
            else {
                return res
                    .status(400)
                    .json({ success: false, message: "Lỗi hình ảnh" });
            }

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
    if (typeof thumbnail === "undefined") {
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp ảnh tiêu đề" });
    }
    if (thumbnail)
        if (
            typeof thumbnail.url !== "string" ||
            typeof thumbnail.public_id !== "string"
        )
            return res
                .status(400)
                .json({ success: false, message: "Vui lòng cung cấp ảnh tiêu đề" });
    if (typeof name !== "string") {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp tên nhà trọ" });
    }
    if (name === "") {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp tên nhà trọ" });
    }
    if (!address) {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp địa chỉ nhà trọ" });
    }
    if (address === "") {
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
    if (desc === "") {
        await unlinkImageMotel(thumbnail, images);
        return res
            .status(400)
            .json({ success: false, message: "Vui lòng cung cấp một vài mô tả" });
    }
    if (!contact ||
        (!contact.phone && !contact.email && !contact.facebook && !contact.zalo)
    ) {
        await unlinkImageMotel(thumbnail, images);
        return res.status(400).json({
            success: false,
            message: "Vui lòng cung cấp ít nhất một cách liên lạc nhà trọ",
        });
    }
    if (typeof status !== "boolean") {
        await unlinkImageMotel(thumbnail, images);
        return res.status(400).json({
            success: false,
            message: "Vui lòng cho biết còn phòng trống hay không",
        });
    }
    if (!images) images = [];
    if (images)
        if (!Array.isArray(images)) images = [images];
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

    const checkUserPost = await user.findById(req.user.id).select("credit");
    if (req.user.isAdmin == true || checkUserPost.credit >= 100) {
        const newMotel = new motel({
            name,
            unsignedName: removeVietNameseTones(name),
            thumbnail,
            images: [],
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
            editor: [],
            available,
        });
        for (let i = 0; i < images.length; i++) {
            const renameImage = await upload.rename(
                images[i].public_id,
                newMotel._id +
                "/" +
                images[i].public_id.substr(images[i].public_id.indexOf("/") + 1)
            );
            if (renameImage.success == true)
                newMotel.images.push({
                    public_id: renameImage.data.public_id,
                    url: renameImage.data.url,
                });
            else {
                for (let j = 0; j < newMotel.images.length; j++)
                    await upload.unlink(newMotel.images[j].public_id);

                for (let j = i; j < images.length; j++)
                    await upload.unlink(images[j].public_id);

                await upload.unlink(thumbnail.public_id);
                return res
                    .status(400)
                    .json({ success: false, message: "Lỗi hình ảnh nhà trọ" });
            }
        }
        const renameThumbnail = await upload.rename(
            thumbnail.public_id,
            newMotel._id +
            "/" +
            thumbnail.public_id.substr(thumbnail.public_id.indexOf("/") + 1)
        );
        if (renameThumbnail.success)
            newMotel.thumbnail = {
                public_id: renameThumbnail.data.public_id,
                url: renameThumbnail.data.url,
            };
        else {
            unlinkImageMotel(thumbnail, newMotel.images);
            return res.status(400).json({ success: false, message: "Lỗi hình ảnh" });
        }

        try {
            const duplicateCheck = await check(newMotel.name, newMotel.school);
            const duplicateUnapprovedCheck = await checkUnapproved(
                newMotel.name,
                newMotel.school
            );
            if (duplicateCheck.dup == true) {
                if (req.user.isAdmin == true) {
                    await unlinkImageMotel(newMotel.thumbnail, newMotel.images);
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
                editor: [],
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
            await unlinkImageMotel(newMotel.thumbnail, newMotel.images);
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
            editor: [],
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
    const findMotel = await motel
        .findById(id)
        .populate("rate.user", "avatarUrl name _id isAdmin")
        .populate("school", "-nameDistricts")
        .populate("owner", "name avatarUrl _id isAdmin credit email school")
        .populate("editor.user", "name avatarUrl _id isAdmin credit email school");
    if (!findMotel)
        return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy nhà trọ này" });
    let images = [];
    findMotel.images.forEach((image) => {
        images.push(image.url);
    });
    let newRate = [];
    for (let i = 0; i < findMotel.rate.length; i++) {
        const userRate = {
            name: findMotel.rate[i].user.name,
            isAdmin: findMotel.rate[i].user.isAdmin,
            _id: findMotel.rate[i]._id,
            avatarUrl: findMotel.rate[i].user.avatarUrl.url,
            credit: findMotel.rate[i].user.name,
        };
        newRate.push({...findMotel.rate[i]._doc, user: userRate });
    }
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

    for (let i = 0; i < findMotel.room.length; i++)
        for (const property in findMotel.room[i].optional) {
            if (findMotel.room[i].optional[property] == true)
                optional[property] = true;
        }
    const ownerSchool = await school
        .findOne({ codeName: findMotel.owner.school })
        .select("-nameDistricts");
    let owner = {
        avatarUrl: findMotel.owner.avatarUrl.url,
        name: findMotel.owner.name,
        isAdmin: findMotel.owner.isAdmin,
        _id: findMotel.owner.id,
        credit: findMotel.owner.credit,
        email: findMotel.owner.email,
        school: ownerSchool,
    };
    let editorData = [];
    for (let i = 0; i < findMotel.editor.length; i++) {
        let editorDataUser;
        const avatarUrl = findMotel.editor[i].user.avatarUrl.url;
        const editorSchool = await school
            .findOne({ codeName: findMotel.editor[i].user.school })
            .select("-nameDistricts");
        editorDataUser = {
            avatarUrl,
            name: findMotel.editor[i].user.name,
            _id: findMotel.editor[i].user._id,
            isAdmin: findMotel.editor[i].user.isAdmin,
            email: findMotel.editor[i].user.email,
            credit: findMotel.editor[i].user.credit,
            school: editorSchool,
        };
        editorData.push({
            user: editorDataUser,
            edited: findMotel.editor[i].edited,
            createdAt: findMotel.editor[i].createdAt,
        });
    }
    const responseMotel = {
        ...findMotel._doc,
        rate: newRate,
        thumbnail: findMotel.thumbnail.url,
        images: images,
        optional,
        owner,
        editor: editorData,
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