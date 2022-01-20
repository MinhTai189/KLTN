const express = require("express");
const router = express.Router();
const user = require("../models/user");
const removeVietNameseTones = require("../utils/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const schoolModel = require("../models/school");
const districtModel = require("../models/districts");
const provinceModel = require("../models/province");
const ObjectId = require("mongoose").Types.ObjectId;
const { changeRank } = require("../utils/creditFunction");

const userRouter = (io) => {
  router.get("/users/done-jobs", verifyToken, async (req, res) => {
    try {
      const done = await user.findById(req.user.id).select("done");
      if (!done)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      const { _page, _limit, _read } = req.query;
      let responseDone = [...done.done].sort((n1, n2) => {
        return new Date(n2.createdAt) - new Date(n1.createdAt);
      });
      let page = 1,
        limit = responseDone.length,
        totalRows = responseDone.length;

      if (!isNaN(parseInt(_limit))) {
        limit = parseInt(_limit);
      }
      if (!isNaN(parseInt(_page))) page = parseInt(_page);
      responseDone = responseDone.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: responseDone,
        pagination: {
          _page: page,
          _limit: limit,
          _totalRows: totalRows,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  router.delete("/users/done-jobs/:id", verifyToken, async (req, res) => {
    const userDid = await user.findOneAndUpdate(
      {
        _id: req.user.id,
      },
      { $pull: { done: { _id: req.params.id } } }
    );
    console.log(userDid);
    if (!userDid)
      return res
        .status(400)
        .json({ message: "Không thành công", success: false });
    res.status(200).json({ message: "Thành công", success: true });
  });
  router.delete("/users/likes/:id", verifyToken, async (req, res) => {
    const likeUser = await user.findOneAndUpdate(
      {
        _id: req.params.id,
        likes: { $in: new ObjectId(req.user.id) },
      },
      { $pull: { likes: req.user.id } }
    );
    console.log(likeUser);
    if (!likeUser)
      return res
        .status(400)
        .json({ message: "unLike không thành công", success: false });
    res.status(200).json({ message: "Thành công", success: true });
  });
  router.post("/users/likes/:id", verifyToken, async (req, res) => {
    const likeUser = await user.findOneAndUpdate(
      {
        _id: req.params.id,
        likes: { $nin: new ObjectId(req.user.id) },
      },
      { $push: { likes: req.user.id } }
    );

    const likedUser = await user.findOne({ _id: req.user.id });

    if (!likeUser)
      return res
        .status(400)
        .json({ message: "Like không thành công", success: false });
    res.status(200).json({ message: "Thành công", success: true });

    if (likeUser && likedUser) {
      io.notifyToUser(likeUser._id, {
        message: `${likedUser.name} đã yêu thích bạn!`,
        url: `/profile/${likedUser._id}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639059634/emoji/Pngtree_hand_drawn_explosion_flower_like_5455515_majure.png",
      });
    }
  });
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
        { "school.codeName": new RegExp(_keysearch.replace(/ /g, "_"), "i") },
        {
          "school.codeName": new RegExp(
            "^" + _keysearch.replace(/ /g, "_"),
            "i"
          ),
        },
        {
          "school.codeName": new RegExp(
            _keysearch.replace(/ /g, "_") + "$",
            "i"
          ),
        },
        { "district.codeName": new RegExp(_keysearch.replace(/ /g, "_"), "i") },
        {
          "district.codeName": new RegExp(
            "^" + _keysearch.replace(/ /g, "_"),
            "i"
          ),
        },
        {
          "district.codeName": new RegExp(
            _keysearch.replace(/ /g, "_") + "$",
            "i"
          ),
        },
        { "province.codeName": new RegExp(_keysearch.replace(/ /g, "_"), "i") },
        {
          "province.codeName": new RegExp(
            "^" + _keysearch.replace(/ /g, "_"),
            "i"
          ),
        },
        {
          "province.codeName": new RegExp(
            _keysearch.replace(/ /g, "_") + "$",
            "i"
          ),
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
        .find({ $or: keySearchs, deleted: false })
        .select("-password")
        .select("-unsignedName -deleted -password -done -notify -favorite");
    } else {
      listUser = await user
        .find({ deleted: false })
        .select("-password")
        .select("-unsignedName -deleted -password -done -notify -favorite");
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
    if (_school)
      listUser = listUser.filter((item) => item.school.codeName === _school);
    if (_district)
      listUser = listUser.filter(
        (item) => item.district.codeName === _district
      );
    if (_province)
      listUser = listUser.filter(
        (item) => item.province.codeName === _province
      );
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
        message: "Thành công",
        data: listUser.map((item) => {
          return {
            ...item._doc,
            school: item.school.name,
            district: item.district.name,
            province: item.province.name,
            totalLikes: item.likes.length,
          };
        }),
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
  router.get("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const getUser = await user
        .findById(id)
        .select(
          "-notify -refreshToken -username  -unsignedName -password -favorite -deleted"
        );

      let responseUser = {
        ...getUser._doc,
        avatarUrl: getUser.avatarUrl.url,
        done: getUser.done.sort(
          (d1, d2) => new Date(d2.createdAt) - new Date(d1.createdAt)
        ),
      };
      res.status(200).json({ data: responseUser, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  });
  router.patch("/users/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    if (JSON.stringify(req.user.id) !== JSON.stringify(id) && !req.user.isAdmin)
      return res
        .status(405)
        .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    const checkUser = await user.findOne({ _id: id, deleted: false });

    if (!checkUser)
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản cần cập nhật!",
      });
    if (
      JSON.stringify(req.user.id) === JSON.stringify(id) &&
      !req.user.isAdmin
    ) {
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
        const { name, school, district, province, avatarUrl } = req.body;
        if (
          !name &&
          typeof avatarUrl === "undefined" &&
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
        if (avatarUrl) {
          newDataUser.avatarUrl = avatarUrl;
        }
        if (school) {
          const getSchool = await schoolModel.findOne({ codeName: school });
          if (getSchool) newDataUser.school = getSchool;
        }
        if (district) {
          const getDistrict = await districtModel.findOne({
            codeName: district,
          });
          if (getDistrict) newDataUser.district = getDistrict;
        }
        if (province) {
          const getProvince = await provinceModel.findOne({
            codeName: province,
          });
          if (getProvince) newDataUser.province = getProvince;
        }
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

        const {
          name,
          school,
          district,
          province,
          isAdmin,
          email,
          credit,
          avatarUrl,
        } = req.body;
        console.log(school, district, province);
        if (
          avatarUrl === undefined &&
          !name &&
          !school &&
          !district &&
          !province &&
          !email &&
          !results &&
          credit === undefined &&
          isAdmin === undefined
        )
          return res.status(400).json({
            success: false,
            message: "Hãy điền đầy đủ thông tin cần cập nhật!",
          });
        if (name) {
          newDataUser.name = name;
          newDataUser.unsignedName = removeVietNameseTones(name);
        }
        if (avatarUrl) {
          newDataUser.avatarUrl = avatarUrl;
        }
        if (school) {
          const getSchool = await schoolModel.findOne({ codeName: school });
          if (getSchool) newDataUser.school = getSchool;
        }
        if (district) {
          const getDistrict = await districtModel.findOne({
            codeName: district,
          });
          if (getDistrict) newDataUser.district = getDistrict;
        }
        if (province) {
          const getProvince = await provinceModel.findOne({
            codeName: province,
          });
          if (getProvince) newDataUser.province = getProvince;
        }

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
          if (typeof credit == "number") changeRank(userUpdated, credit, io);
          if (req.user.isAdmin)
            io.notifyToUser(userUpdated._id, {
              message: `Thông tin cá nhân của bạn đã được người quản trị cập nhật`,
              url: `/profile/${userUpdated._id}`,
              imageUrl:
                "https://res.cloudinary.com/dpregsdt9/image/upload/v1638661792/notify/security_bsszl5.png",
            });
        }
      } catch (err) {
        res.status(500);
      }
  });

  router.delete("/users/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    if (JSON.stringify(req.user.id) !== JSON.stringify(id) && !req.user.isAdmin)
      return res
        .status(405)
        .json({ success: false, message: "Không đủ quyền hạn truy cập" });

    try {
      const userDelete = await user.findByIdAndUpdate(id, {
        $set: {
          deleted: true,
          avatarUrl: {
            url: `https://res.cloudinary.com/dpregsdt9/image/upload/v1631352198/user-avatar/avatar-default_vzl8ur.jpg`,
          },
        },
      });
      io.sendDashboardStatisticals("accounts");
      if (!userDelete)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      if (userDelete.avatarUrl.public_id) {
        const unlinkFile = upload.unlink(userDelete.avatarUrl.public_id);
      }
      return res
        .status(200)
        .json({ success: false, message: "Đã xóa người dùng" });
    } catch {
      res.status(422).json({ success: false, message: "Vui lòng thử lại" });
    }
  });
  return router;
};
module.exports = userRouter;
