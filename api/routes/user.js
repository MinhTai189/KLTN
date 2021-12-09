const express = require("express");
const router = express.Router();
const user = require("../models/user");
const removeVietNameseTones = require("../utils/removeVietnameseTones");
const argon2 = require("argon2");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");
const school = require("../models/school");
const district = require("../models/districts");
const province = require("../models/province");
const ObjectId = require("mongoose").Types.ObjectId;
const userRouter = (io) => {
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
    console.log(likeUser);
    if (!likeUser)
      return res
        .status(400)
        .json({ message: "Like không thành công", success: false });
    res.status(200).json({ message: "Thành công", success: true });
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
        .find({ $or: keySearchs, deleted: false })
        .select("-password")
        .select("-unsignedName -deleted");
    } else {
      listUser = await user
        .find({ deleted: false })
        .select("-password")
        .select("-unsignedName -deleted");
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
  router.get("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const getUser = await user
        .findById(id)
        .select(
          "-notify -refreshToken -favorite -unsignedName -password -deleted"
        );

      const getUserSchool = await school
        .findOne({ codeName: getUser.school })
        .select("-nameDistricts");
      const getUserDistrict = await district.findOne({
        codeName: getUser.district,
      });
      const getUserProvince = await province.findOne({
        codeName: getUser.province,
      });
      let responseUser = {
        ...getUser._doc,
        avatarUrl: getUser.avatarUrl.url,
        district: getUserDistrict,
        province: getUserProvince,
        school: getUserSchool,
        totalLikes: getUser.likes.length,
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
          if (req.user.isAdmin)
            io.notifyToUser(userUpdated._id, {
              message: `Thông tin cá nhân của bạn đã được cập nhật`,
              url: `/users/${userUpdated._id}`,
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
  return router;
};
module.exports = userRouter;
