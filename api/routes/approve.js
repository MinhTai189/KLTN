const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const feedBack = require("../models/feedBack");
const motel = require("../models/motel");
const unapprovedMotel = require("../models/unapproved-motel");
const userUpdateMotel = require("../models/user-update-motel");
const userUpdateRoom = require("../models/user-update-room");
const post = require("../models/post");
const school = require("../models/school");
const report = require("../models/report");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const review = require("../models/review");
const comment = require("../models/comment");
const upload = require("../middleware/upload");
const nullMotel = require("../utils/nullMotel");
const router = express.Router();
const approveRouter = (io) => {
  router.delete("/motels/:type/:id", verifyToken, async (req, res) => {
    const type = req.params.type;
    const id = req.params.id;
    if (type == "add") {
      const addMotel = await unapprovedMotel.findByIdAndDelete(id);
      if (!addMotel)
        if (!addMotel)
          return res
            .status(400)
            .json({ message: "Không tìm thấy thông tin mới", success: false });
      for (let i = 0; i < addMotel.images.length; i++) {
        await upload.unlink(addMotel.images[i].public_id);
      }
      await upload.unlink(addMotel.thumbnail.public_id);
    } else if (type == "update") {
      const updateMotel = await userUpdateMotel.findByIdAndDelete(id);
      for (let i = 0; i < updateMotel.images.length; i++) {
        if (updateMotel.images[i].public_id)
          await upload.unlink(updateMotel.images[i].public_id);
      }
      if (updateMotel.thumbnail.public_id)
        await upload.unlink(updateMotel.thumbnail.public_id);
    }
    res.status(200).json({ success: true, message: "Thành công" });
  });

  //chua co gi ca
  router.patch("/motels/:id", verifyToken, async (req, res) => {
    //duyệt motel update
    res.status(400).json({ message: "Chưa có gì cả", success: false });
  });
  //good
  router.post("/motels/:id", verifyToken, async (req, res) => {
    // duyệt nhà trọ mới
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const checkMotel = await unapprovedMotel.findById(req.params.id);
      if (!checkMotel)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin mới", success: false });
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
      let images = checkMotel.images;

      for (let i = 0; i < images.length; i++) {
        const renameImage = await upload.rename(
          images[i].public_id,
          newMotel._id +
            "/" +
            images[i].public_id.substr(images[i].public_id.indexOf("/") + 1)
        );
        if (renameImage.success == true)
          newMotel.images = [
            ...newMotel.images,
            {
              public_id: renameImage.data.public_id,
              url: renameImage.data.url,
            },
          ];
        else {
          for (let j = 0; j < newMotel.images.length; j++)
            await upload.rename(
              newMotel.images[j].public_id,
              newMotel.name +
                "/" +
                newMotel.images[j].public_id.substr(
                  newMotel.images[j].public_id.indexOf("/") + 1
                )
            );

          return res
            .status(400)
            .json({ success: false, message: "Lỗi khi xử lý hình ảnh!" });
        }
      }
      const renameThumbnail = await upload.rename(
        newMotel.thumbnail.public_id,
        newMotel._id +
          "/" +
          newMotel.thumbnail.public_id.substr(
            newMotel.thumbnail.public_id.indexOf("/") + 1
          )
      );
      if (renameThumbnail.success == false) {
        for (let j = 0; j < newMotel.images.length; j++)
          await upload.rename(
            newMotel.images[j].public_id,
            newMotel.name +
              "/" +
              newMotel.images[j].public_id.substr(
                newMotel.images[j].public_id.indexOf("/") + 1
              )
          );

        return res
          .status(400)
          .json({ success: false, message: "Lỗi khi xử lý hình ảnh!" });
      } else
        newMotel.thumbnail = {
          url: renameThumbnail.data.url,
          public_id: renameThumbnail.data.public_id,
        };
      await newMotel.save();
      io.notifyToUser(checkMotel.owner, {
        message: `Chúc mừng nhà trọ bạn đăng đã được duyệt!`,
        url: `/motels/${newMotel._id}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639490398/notify/verified_rrd4yn.png",
      });
      io.notifyToAllUser({
        message: ` vừa đăng nhà trọ mới, hãy tham khảo ngay`,
        url: `/motels/${newMotel._id}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1638661792/notify/motel_opx8rh.png",
        ownerId: checkMotel.owner,
      });
      res.status(200).json({ message: "Duyệt thành công", success: true });
      await unapprovedMotel.findByIdAndDelete(req.params.id);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  });
  ///ok
  router.get("/motels/comparisons/:id", verifyToken, async (req, res) => {
    // so sánh nhà trọ cũ và mới trong upadate nhà trọ
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const newMotel = await userUpdateMotel
        .findById(req.params.id)
        .populate("user", "-notify -refreshToken -done -deleted -password")
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");
      if (!newMotel)
        return res.status(400).json({
          message: "Không tìm thấy thông tin cập nhật",
          success: false,
        });
      const oldMotel = await motel
        .findById(newMotel.motel)
        .populate("owner", "-notify -refreshToken -done -deleted -password")
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");
      if (!oldMotel)
        return res
          .status(400)
          .json({ message: "Nhà trọ cần cập nhật đã bị xóa", success: false });
      let responseOldMotel = {
        ...oldMotel._doc,
        owner: {
          ...oldMotel.owner._doc,
          avatarUrl: oldMotel.owner.avatarUrl.url,
        },
        images: oldMotel.images.map((image) => {
          if (image.url) return image.url;
          else return image;
        }),
        thumbnail: oldMotel.thumbnail.url,
      };
      const getThumbnail = (t) => {
        if (t.url) return t.url;
        else return t;
      };
      let responseNewMotel = {
        ...newMotel._doc,
        owner: {
          ...newMotel.user._doc,
          avatarUrl: newMotel.user.avatarUrl.url,
        },
        images: oldMotel.images.map((image) => {
          if (image.url) return image.url;
          else return image;
        }),
        thumbnail: getThumbnail(newMotel.thumbnail),
      };
      delete responseNewMotel.user;
      res.status(200).json({
        data: { old: responseOldMotel, new: responseNewMotel },
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  //good
  router.get("/motels", verifyToken, async (req, res) => {
    // lấy nhà trọ mới và update nhà trọ mới
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const allMotel = await motel.find();
      const motelNewUpdate = await userUpdateMotel
        .find()
        .populate("user", "-notify -refreshToken -done -deleted -password")
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");
      const newMotel = await unapprovedMotel
        .find()
        .populate(
          "owner",
          "-notify -refreshToken -done -deleted -password -unsignedName"
        )
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");

      // let owner = {
      //   avatarUrl: newMotel.owner.avatarUrl.url,
      //   name: newMotel.owner.name,
      //   isAdmin: newMotel.owner.isAdmin,
      //   _id: newMotel.owner._id,
      //   credit: newMotel.owner.credit,
      //   email: newMotel.owner.email,
      //   school: ownerSchool,
      //   motels: newMotel.owner.motels,
      //   rank: newMotel.owner.rank,
      // };
      const arrayAll = [...motelNewUpdate.concat(newMotel)];
      let response = [];
      const getThumbnail = (t) => {
        if (t.url) return t.url;
        else return t;
      };
      for (let i = 0; i < arrayAll.length; i++) {
        let owner;
        if (arrayAll[i].owner == undefined)
          owner = {
            ...arrayAll[i].user._doc,
            avatarUrl: arrayAll[i].user.avatarUrl.url,
          };
        else
          owner = {
            ...arrayAll[i].owner._doc,
            avatarUrl: arrayAll[i].owner.avatarUrl.url,
          };

        response.push({
          ...arrayAll[i]._doc,
          thumbnail: getThumbnail(arrayAll[i].thumbnail),
          images: arrayAll[i].images.map((image) => {
            if (image.url) return image.url;
            else return image;
          }),
          owner: owner,
        });
        if (response[i].user) response[i].type = "update";
        else {
          response[i].type = "add";
          response[i].nhaTroTrung = [];
          for (let j = 0; j < response[i].duplicate.length; j++) {
            const getDuplicateMotel = allMotel.find((item) => {
              return (
                JSON.stringify(item._id) ===
                JSON.stringify(response[i].duplicate[j])
              );
            });
            if (getDuplicateMotel)
              response[i].nhaTroTrung.push({
                _id: getDuplicateMotel._id,
                name: getDuplicateMotel.name,
              });
          }
          response[i].nhaTroChuaDuyetTrung = [];
          for (let j = 0; j < response[i].duplicateUnapproved.length; j++) {
            const getDuplicateMotel = newMotel.find((item) => {
              return (
                JSON.stringify(item._id) ===
                JSON.stringify(response[i].duplicateUnapproved[j])
              );
            });
            if (getDuplicateMotel)
              response[i].nhaTroChuaDuyetTrung.push({
                _id: getDuplicateMotel._id,
                name: getDuplicateMotel.name,
              });
          }
        }
        delete response[i].user;
        delete response[i].duplicateUnapproved;
        delete response[i].duplicate;
      }
      const { _limit, _page } = req.query;

      let page = 1,
        limit = response.length,
        totalRows = response.length;

      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      response = response.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: response,
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
  //good
  router.delete("/reports/:id", verifyToken, async (req, res) => {
    // Xóa tó cáo
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const id = req.params.id;
      const delReport = await report.findByIdAndDelete(id);
      if (!delReport)
        return res
          .status(400)
          .json({ message: "Không tìm được nội dung báo cáo", success: false });

      res.status(200).json({ message: "Thành công", success: true });
      let url = "";
      if (delReport.type === "post") url = "posts/" + delReport.id1;
      else if (delReport.type === "rate") url = "motels/" + delReport.id1;
      io.notifyToUser(delReport.owner, {
        message: `Thông tin tố cáo bạn gửi là sai sự thật.`,
        url: `/${url}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639701129/notify/qqorbp63avq7cpiygrxj.png",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  //good
  router.post("/reports/:id", verifyToken, async (req, res) => {
    // Xóa tó cáo+ xóa nội dung + trừ điểm thằng bi tố cáo
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const id = req.params.id;
      const delReport = await report.findByIdAndDelete(id);
      if (!delReport)
        return res
          .status(400)
          .json({ message: "Không tìm được nội dung báo cáo", success: false });

      res.status(200).json({ message: "Thành công", success: true });
      let dataReport;
      if (delReport.type === "comment") {
        dataReport = await comment.findByIdAndDelete(delReport.id1);
        if (dataReport)
          io.notifyToUser(dataReport.owner, {
            message: `Bình luận của bạn đã bị xóa vì vi phạm nguyên tắc cộng đồng`,
            url: `/posts/${dataReport.post}`,
            imageUrl:
              "https://res.cloudinary.com/dpregsdt9/image/upload/v1639744800/notify/b2ff8pc5qbbtc9sqbvq4.png",
          });
      } else if (delReport.type === "post") {
        dataReport = await post.findByIdAndDelete(delReport.id1);
        if (dataReport)
          io.notifyToUser(dataReport.owner, {
            message: `Bài viết của bạn đã bị xóa vì vi phạm nguyên tắc cộng đồng`,
            url: `/posts/`,
            imageUrl:
              "https://res.cloudinary.com/dpregsdt9/image/upload/v1639744800/notify/b2ff8pc5qbbtc9sqbvq4.png",
          });
      } else if (delReport.type == "rate") {
        getReportRateMotel = await motel.findById(delReport.id1);
        dataReport = getReportRateMotel.find(
          (item) => JSON.stringify(item._id) === JSON.stringify(delReport.id2)
        );
        if (dataReport)
          io.notifyToUser(dataReport.owner, {
            message: `Đánh giá nhà trọ của bạn đã bị xóa vì vi phạm nguyên tắc cộng đồng`,
            url: `/motels/${getReportRateMotel._id}`,
            imageUrl:
              "https://res.cloudinary.com/dpregsdt9/image/upload/v1639744800/notify/b2ff8pc5qbbtc9sqbvq4.png",
          });
      }

      io.notifyToUser(delReport.owner, {
        message: `Chúng tôi đã xem xét thông tin tố cáo bạn đã gửi. Chân thành cám ơn sự đóng góp của bạn`,
        url: `/`,
        imageUrl:
          "http://res.cloudinary.com/dpregsdt9/image/upload/v1639808792/notify/dpebhnmfzkxu6ojekj3r.png",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });

  //ok
  router.get("/reports", verifyToken, async (req, res) => {
    // lấy các tố cáo
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const { _limit, _page } = req.query;
      let rates = [];
      const allMotel = await motel
        .find({})
        .populate(
          "rate.user",
          "avatarUrl: rates[i].user.avatarUrl.url name isAdmin _id credit email posts motels rank"
        );
      for (let i = 0; i < allMotel.length; i++)
        for (let j = 0; j < allMotel[i].rate.length; j++)
          if (allMotel[i].rate[j].valid == true)
            rates.push({
              ...allMotel[i].rate[j]._doc,
              motel: { _id: allMotel[i]._id, name: allMotel[i].name },
            });
      for (let i = 0; i < rates.length; i++) {
        // const ownerSchool = await school
        //   .findOne({ codeName: rates[i].user.school })
        //   .select("-nameDistricts");
        let owner = {
          avatarUrl: rates[i].user.avatarUrl.url,
          name: rates[i].user.name,
          isAdmin: rates[i].user.isAdmin,
          _id: rates[i].user.id,
          credit: rates[i].user.credit,
          email: rates[i].user.email,
          //  school: ownerSchool,
          motels: rates[i].user.motels,
          rank: rates[i].user.rank,
        };
        rates[i].owner = owner;
        delete rates[i].user;
      }
      const getComments = await comment.find();
      const getPosts = await post.find();
      const getReports = await report
        .find()
        .populate(
          "owner",
          "-done -notify -refreshToken -username -email -unsignedName -password -favorite -deleted -province -district"
        );

      let response = [];
      for (let i = 0; i < getReports.length; i++) {
        let getData;
        if (getReports[i].type === "rate")
          getData = rates.find((item) => {
            return (
              JSON.stringify(item._id) === JSON.stringify(getReports[i].id2) &&
              JSON.stringify(item.motel._id) ===
                JSON.stringify(getReports[i].id1)
            );
          });
        else if (getReports[i].type === "post")
          getData = getPosts.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(getReports[i].id1)
          );
        else if (getReports[i].type === "comment")
          getData = getComments.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(getReports[i].id1)
          );
        if (getData)
          response = [
            ...response,
            {
              ...getReports[i]._doc,
              id1: undefined,
              id2: undefined,
              owner: {
                ...getReports[i].owner._doc,
                avatarUrl: getReports[i].owner.avatarUrl.url,
              },
              data: getData,
            },
          ];
      }
      let page = 1,
        limit = response.length,
        totalRows = response.length;

      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      response = response.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: response,
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

  //good
  router.delete("/posts/:id", verifyToken, async (req, res) => {
    //Xóa post khôgn duyệt

    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const id = req.params.id;
      const deletePost = await post.findOneAndDelete({ _id: id, valid: false });
      if (!deletePost)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin", success: false });
      res.status(200).json({ success: true, message: "Thành công" });
      io.notifyToUser(deletePost.owner, {
        message: `Bài viết bạn gửi đã bị người quản lý xóa`,
        url: `/post/`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639701129/notify/qqorbp63avq7cpiygrxj.png",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  //good
  router.post("/posts/:id", verifyToken, async (req, res) => {
    // duyệt post
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const id = req.params.id;
      const approvePost = await post.findOneAndUpdate(
        { _id: id, valid: false },
        { valid: true }
      );
      io.notifyToUser(approvePost.owner, {
        message: `Bài viết của bạn đã được duyệt`,
        url: `/posts/${approvePost._id}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639490398/notify/verified_rrd4yn.png",
      });
      res.status(200).json({ message: "Đã duyệt bài viết", success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });

  //good
  router.get("/posts", verifyToken, async (req, res) => {
    // lấy post chưa duyệt
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const getPosts = await post
        .find({ valid: false })
        .select("-unsignedTitle")
        .populate("subject", "name")
        .populate("motel", "-rate")
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank"
        );
      let response = [];
      const { _limit, _page } = req.query;

      for (let i = 0; i < getPosts.length; i++) {
        response = [
          ...response,
          {
            ...getPosts[i]._doc,
            owner: {
              ...getPosts[i].owner._doc,
              avatarUrl: getPosts[i].owner.avatarUrl.url,
            },
          },
        ];

        if (getPosts[i].motel != undefined && getPosts[i].motel != null) {
          const motelPost = {
            ...getPosts[i].motel._doc,
            thumbnail: getPosts[i].motel.thumbnail.url,
            images: getPosts[i].motel.images.map((item) => item.url),
          };
          response[i].motel = motelPost;
        }
        if (getPosts[i].motel == null && getPosts[i].type != 1)
          response[i].motel = nullMotel;
      }

      let page = 1,
        limit = response.length,
        totalRows = response.length;

      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      response = response.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: response,
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

  // good
  router.delete("/rates/:motelId/:id", verifyToken, async (req, res) => {
    //Xóa đánh giá không duyệt
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const motelId = req.params.motelId;
      const id = req.params.id;
      const unapproveRate = await motel.findOneAndUpdate(
        { _id: motelId },
        {
          $pull: { rate: { _id: id, valid: false } },
        }
      );
      if (!unapproveRate)
        return res
          .status(400)
          .json({ message: "Có lỗi xảy ra", success: false });

      res.status(200).json({ success: true, message: "Thành công" });
      if (
        unapproveRate.rate.find(
          (item) => JSON.stringify(item._id) === JSON.stringify(id)
        )
      )
        io.notifyToUser(
          unapproveRate.rate.find(
            (item) => JSON.stringify(item._id) === JSON.stringify(id)
          ).user,
          {
            message: `Đánh giá nhà trọ bạn gửi đã bị người quản lý xóa`,
            url: `/motels/${unapproveRate._id}`,
            imageUrl:
              "https://res.cloudinary.com/dpregsdt9/image/upload/v1639701129/notify/qqorbp63avq7cpiygrxj.png",
          }
        );
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });

  //good
  router.post("/rates/:motelId/:id", verifyToken, async (req, res) => {
    // Duyệt đánh giá
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const motelId = req.params.motelId;
      const id = req.params.id;
      const approveRate = await motel.findOneAndUpdate(
        { _id: motelId, "rate._id": id, "rate.valid": false },
        { $set: { "rate.$.valid": true } }
      );
      const findRate = approveRate.rate.find(
        (item) => JSON.stringify(id) === JSON.stringify(item._id)
      );
      if (!approveRate)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin", success: false });
      res.status(200).json({ message: "Thành công", success: true });
      await motel.findOneAndUpdate(
        { _id: motelId },
        {
          vote: approveRate.vote + findRate.star,
          mark:
            (approveRate.vote + findRate.star) /
            (approveRate.rate.filter((item) => item.valid == true).length + 1),
        }
      );
      io.notifyToUser(
        approveRate.rate.find(
          (item) => JSON.stringify(item._id) === JSON.stringify(id)
        ).user,
        {
          message: `Đánh giá nhà trọ bạn gửi đã được duyệt! Xin chân thành cảm ơn`,
          url: `/motels/${approveRate._id}`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639490398/notify/verified_rrd4yn.png",
        }
      );
      if (
        JSON.stringify(
          approveRate.rate.find(
            (item) => JSON.stringify(item._id) === JSON.stringify(id)
          ).user
        ) !== JSON.stringify(approveRate.owner)
      )
        io.notifyToUser(approveRate.owner, {
          message: ` vừa đánh giá về nhà trọ bạn đăng`,
          url: `/motels/${approveRate._id}`,
          ownerId: approveRate.rate.find(
            (item) => JSON.stringify(item._id) === JSON.stringify(id)
          ).user,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1638662093/notify/rating_x9e2j5.png",
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  // good
  router.get("/rates", verifyToken, async (req, res) => {
    // lấy dánh sách đánh giá chưa duyệt
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      let rates = [];
      const allMotel = await motel
        .find({})
        .populate(
          "rate.user",
          "avatarUrl name isAdmin _id credit email posts motels rank"
        );
      for (let i = 0; i < allMotel.length; i++)
        for (let j = 0; j < allMotel[i].rate.length; j++)
          if (allMotel[i].rate[j].valid == false)
            rates.push({
              ...allMotel[i].rate[j]._doc,
              motel: { _id: allMotel[i]._id, name: allMotel[i].name },
            });
      for (let i = 0; i < rates.length; i++) {
        // const ownerSchool = await school
        //   .findOne({ codeName: rates[i].user.school })
        //   .select("-nameDistricts");
        let owner = {
          avatarUrl: rates[i].user.avatarUrl.url,
          name: rates[i].user.name,
          isAdmin: rates[i].user.isAdmin,
          _id: rates[i].user.id,
          credit: rates[i].user.credit,
          email: rates[i].user.email,
          //  school: ownerSchool,
          motels: rates[i].user.motels,
          rank: rates[i].user.rank,
        };
        rates[i].owner = owner;
        delete rates[i].user;
      }
      let response = [...rates];
      const { _limit, _page } = req.query;

      let page = 1,
        limit = response.length,
        totalRows = response.length;

      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      response = response.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: response,
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

  // router.delete("/", async (req, res) => {
  //   const { _id1, _id2, _type } = req.query;
  //   if (_type === "post") {
  //     const deletePostInvalid = await post.findOneAndDelete({
  //       _id: _id1,
  //       valid: false,
  //     });
  //     if (!deletePostInvalid)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "Không tìm thây bài viết" });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Đã xóa thông tin này" });
  //   } else if (_type === "report") {
  //     const deleteReport = await report.findByIdAndDelete(_id1);

  //     if (!deleteReport)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "Không tìm thấy report này" });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Đã xóa thông tin này" });
  //   } else if (_type === "rate") {
  //     const getMotelRating = await motel.findById(_id1);
  //     if (!getMotelRating)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy đánh giá này hoặc đã bị xóa",
  //       });
  //     const getRate = getMotelRating.rate.find((item) => {
  //       return JSON.stringify(_id2) === JSON.stringify(item._id);
  //     });
  //     if (!getRate)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy đánh giá này hoặc đánh giá đã bị xóa",
  //       });
  //     try {
  //       await motel.findOneAndUpdate(
  //         { _id: _id1 },
  //         {
  //           $pull: { rate: { _id: _id2 } },
  //         }
  //       );
  //       return res
  //         .status(200)
  //         .json({ success: true, message: "Đã xóa thông tin này" });
  //     } catch (err) {
  //       console.log(err);
  //       return res
  //         .status(500)
  //         .json({ success: false, message: "Lỗi không xác định" });
  //     }
  //   } else if (_type === "room") {
  //     const getNewUpdateRoom = await userUpdateRoom.findByIdAndDelete(_id1);
  //     if (!getNewUpdateRoom)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy thông tin cập nhật nhật này",
  //       });
  //     else
  //       return res
  //         .status(200)
  //         .json({ success: true, message: "Đã xóa thông tin này" });
  //   } else if (_type === "motel") {
  //     const motelNewUpdate = await userUpdateMotel.findByIdAndDelete(_id1);
  //     if (!motelNewUpdate)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm được thông tin cập nhật này",
  //       });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Đã xóa thông tin này" });
  //   } else if (_type === "new-motel") {
  //     const newMotel = await unapprovedMotel.findByIdAndDelete(_id1);
  //     if (!newMotel)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy thông tin nhà trọ này",
  //       });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Đã xóa thông tin này" });
  //   } else if (_type === "feedback") {
  //     const getFeedBack = await feedBack.findByIdAndDelete(_id1);
  //     if (!getFeedBack)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy phản hồi này",
  //       });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Đã xóa thông tin này" });
  //   }
  // });

  // router.get("/details", async (req, res) => {
  //   const { _id1, _id2, _type } = req.query;
  //   let response;
  //   if (_type === "post") {
  //     const getPostInvalid = await post
  //       .findById(_id1)
  //       .populate("subject")
  //       .populate("owner", "-unsignedName -refreshToken")
  //       .select("-valid");
  //     if (!getPostInvalid)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "Không tìm thây bài viết" });
  //     if (getPostInvalid.valid == true)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "Bài viết này đã được duyệt rồi" });
  //     response = { ...getPostInvalid._doc };
  //     let owner = {
  //       avatarUrl: response.owner.avatarUrl.url,
  //       name: response.owner.name,
  //       isAdmin: response.owner.isAdmin,
  //       _id: response.owner.id,
  //       credit: response.owner.credit,
  //       email: response.owner.email,
  //       //   school: ownerSchool,
  //       motels: response.owner.motels,
  //       rank: response.owner.rank,
  //     };

  //     response.owner = owner;
  //   } else if (_type === "report") {
  //     const getReport = await report
  //       .findById(_id1)
  //       .populate("owner", "-unsignedName -refreshToken");
  //     if (!getReport)
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "Không tìm thấy report này" });
  //     if (getReport.type === "rate") {
  //       const getMotelRating = await motel.findById(getReport.id1);
  //       if (!getMotelRating)
  //         return res.status(400).json({
  //           success: false,
  //           message: "Không tìm thấy nhà trọ này hoặc nhà trọ đã bị xóa",
  //         });
  //       const getRate = getMotelRating.rate.find((item) => {
  //         return JSON.stringify(getReport.id2) === JSON.stringify(item._id);
  //       });
  //       if (!getRate)
  //         return res.status(400).json({
  //           success: false,
  //           message: "Không tìm thấy đánh giá này hoặc đánh giá đã bị xóa",
  //         });
  //       response = {
  //         rate: {
  //           ...getRate._doc,
  //           motel: getMotelRating._id,
  //         },
  //         content: getReport.content,
  //         owner: getReport.owner,
  //       };
  //       const ownerSchool = await school
  //         .findOne({ codeName: response.owner.school })
  //         .select("-nameDistricts");
  //       let owner = {
  //         avatarUrl: response.owner.avatarUrl.url,
  //         name: response.owner.name,
  //         isAdmin: response.owner.isAdmin,
  //         _id: response.owner.id,
  //         credit: response.owner.credit,
  //         email: response.owner.email,
  //         school: ownerSchool,
  //         motels: response.owner.motels,
  //         rank: response.owner.rank,
  //       };
  //       response.owner = owner;
  //     } else if (getReport.type === "post") {
  //       const getPost = await post.findById(getReport.id1);
  //       if (!getPost)
  //         return res.status(400).json({
  //           success: false,
  //           message: "Không tìm thấy bài viết này hoặc bài viết đã bị xóa",
  //         });
  //       response = {
  //         post: {
  //           ...getPost._doc,
  //         },
  //         content: getReport.content,
  //         owner: getReport.owner,
  //       };
  //       const ownerSchool = await school
  //         .findOne({ codeName: response.owner.school })
  //         .select("-nameDistricts");
  //       let owner = {
  //         avatarUrl: response.owner.avatarUrl.url,
  //         name: response.owner.name,
  //         isAdmin: response.owner.isAdmin,
  //         _id: response.owner.id,
  //         credit: response.owner.credit,
  //         email: response.owner.email,
  //         school: ownerSchool,
  //         motels: response.owner.motels,
  //         rank: response.owner.rank,
  //       };
  //       response.owner = owner;
  //     } else if (getReport.type === "comment") {
  //       const getComment = await comment.findById(getReport.id1);
  //       if (!getComment)
  //         return res.status(400).json({
  //           success: false,
  //           message: "Không tìm thấy bài viết này hoặc bài viết đã bị xóa",
  //         });
  //       response = {
  //         comment: {
  //           ...getComment._doc,
  //         },
  //         content: getReport.content,
  //         owner: getReport.owner,
  //       };
  //       const ownerSchool = await school
  //         .findOne({ codeName: response.owner.school })
  //         .select("-nameDistricts");
  //       let owner = {
  //         avatarUrl: response.owner.avatarUrl.url,
  //         name: response.owner.name,
  //         isAdmin: response.owner.isAdmin,
  //         _id: response.owner.id,
  //         credit: response.owner.credit,
  //         email: response.owner.email,
  //         school: ownerSchool,
  //         motels: response.owner.motels,
  //         rank: response.owner.rank,
  //       };
  //       response.owner = owner;
  //     }
  //   } else if (_type === "rate") {
  //     const getMotelRating = await motel
  //       .findById(_id1)
  //       .populate("rate.user", "-unsignedName -refreshToken");
  //     if (!getMotelRating)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy nhà trọ này hoặc nhà trọ đã bị xóa",
  //       });
  //     const getRate = getMotelRating.rate.find((item) => {
  //       return JSON.stringify(_id2) === JSON.stringify(item._id);
  //     });
  //     if (!getRate)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy đánh giá này hoặc đánh giá đã bị xóa",
  //       });

  //     let resRate = { ...getRate._doc, motel: getMotelRating._id };
  //     const ownerSchool = await school
  //       .findOne({ codeName: resRate.user.school })
  //       .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: resRate.user.avatarUrl.url,
  //       name: resRate.user.name,
  //       isAdmin: resRate.user.isAdmin,
  //       _id: resRate.user._id,
  //       credit: resRate.user.credit,
  //       email: resRate.user.email,
  //       school: ownerSchool,
  //       motels: resRate.user.motels,
  //       rank: resRate.user.rank,
  //     };
  //     delete resRate.user;
  //     resRate.owner = owner;
  //     response = resRate;
  //   } else if (_type === "room") {
  //     const getNewUpdateRoom = await userUpdateRoom
  //       .findById(_id1)
  //       .populate("motel")
  //       .populate("user", "-refreshToken -password");
  //     if (!getNewUpdateRoom)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy thông tin cập nhật nhật này",
  //       });
  //     const getMotel = getNewUpdateRoom.motel;

  //     const getRoom = getMotel.room.find((item) => {
  //       return (
  //         JSON.stringify(getNewUpdateRoom.room) === JSON.stringify(item._id)
  //       );
  //     });
  //     if (!getRoom)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm thấy phòng này hoặc đã bị xóa",
  //       });
  //     console.log(getNewUpdateRoom);
  //     const ownerSchool = await school
  //       .findOne({ codeName: getNewUpdateRoom.user.school })
  //       .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: getNewUpdateRoom.user.avatarUrl.url,
  //       name: getNewUpdateRoom.user.name,
  //       isAdmin: getNewUpdateRoom.user.isAdmin,
  //       _id: getNewUpdateRoom.user._id,
  //       credit: getNewUpdateRoom.user.credit,
  //       email: getNewUpdateRoom.user.email,
  //       school: ownerSchool,
  //       motels: getNewUpdateRoom.user.motels,
  //       rank: getNewUpdateRoom.user.rank,
  //     };
  //     let newRoom = {
  //       ...getNewUpdateRoom._doc,
  //     };
  //     delete newRoom.type;
  //     delete newRoom.motel;
  //     delete newRoom.user;
  //     delete newRoom.room;
  //     response = {
  //       oldRoom: {
  //         ...getRoom._doc,
  //       },
  //       newRoom,
  //       owner,
  //     };
  //   } else if (_type === "motel") {
  //     const motelNewUpdate = await userUpdateMotel
  //       .findById(_id1)
  //       .populate("user")
  //       .select("-unsignedName -room")
  //       .populate("school", "-nameDistricts");
  //     if (!motelNewUpdate)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Không tìm được thông tin cập nhật này",
  //       });
  //     const findMotel = await motel
  //       .findById(motelNewUpdate.motel)
  //       .populate("owner")
  //       .select("-unsignedName -room")
  //       .populate("school", "-nameDistricts");
  //     if (!findMotel)
  //       return res.status(400).json({
  //         success: false,
  //         message: "Nhà trọ này không tồn tại hoặc đã bị xóa",
  //       });
  //     const ownerNewSchool = await school
  //       .findOne({ codeName: motelNewUpdate.user.school })
  //       .select("-nameDistricts");
  //     let ownerNew = {
  //       avatarUrl: motelNewUpdate.user.avatarUrl.url,
  //       name: motelNewUpdate.user.name,
  //       isAdmin: motelNewUpdate.user.isAdmin,
  //       _id: motelNewUpdate.user._id,
  //       credit: motelNewUpdate.user.credit,
  //       email: motelNewUpdate.user.email,
  //       school: ownerNewSchool,
  //       motels: motelNewUpdate.user.motels,
  //       rank: motelNewUpdate.user.rank,
  //     };
  //     const ownerOldSchool = await school
  //       .findOne({ codeName: findMotel.owner.school })
  //       .select("-nameDistricts");
  //     let ownerOld = {
  //       avatarUrl: findMotel.owner.avatarUrl.url,
  //       name: findMotel.owner.name,
  //       isAdmin: findMotel.owner.isAdmin,
  //       _id: findMotel.owner._id,
  //       credit: findMotel.owner.credit,
  //       email: findMotel.owner.email,
  //       school: ownerOldSchool,
  //       motels: findMotel.owner.motels,
  //     };
  //     let newMotel = {
  //       ...motelNewUpdate._doc,
  //       owner: ownerNew,
  //       thumbnail: motelNewUpdate.thumbnail.url,
  //       images: motelNewUpdate.images.map((item) => {
  //         if (typeof item === "string") return item;
  //         else return item.url;
  //       }),
  //     };
  //     delete newMotel.user;

  //     response = {
  //       newMotel,
  //       oldMotel: {
  //         ...findMotel._doc,
  //         owner: ownerOld,
  //         thumbnail: findMotel.thumbnail.url,
  //         images: findMotel.images.map((item) => {
  //           return item.url;
  //         }),
  //       },
  //     };
  //   } else if (_type === "new-motel") {
  //     const newMotel = await unapprovedMotel
  //       .findById(_id1)
  //       .populate("owner")
  //       .select("-unsignedName")
  //       .populate("school", "-nameDistricts");
  //     const ownerSchool = await school
  //       .findOne({ codeName: newMotel.owner.school })
  //       .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: newMotel.owner.avatarUrl.url,
  //       name: newMotel.owner.name,
  //       isAdmin: newMotel.owner.isAdmin,
  //       _id: newMotel.owner._id,
  //       credit: newMotel.owner.credit,
  //       email: newMotel.owner.email,
  //       school: ownerSchool,
  //       motels: newMotel.owner.motels,
  //       rank: newMotel.owner.rank,
  //     };
  //     response = {
  //       ...newMotel._doc,
  //       owner: owner,
  //       thumbnail: newMotel.thumbnail.url,
  //       images: newMotel.images.map((item) => {
  //         return item.url;
  //       }),
  //     };
  //   } else if (_type === "feedback") {
  //     const getFeedBack = await feedBack.findById(_id1).populate("owner");
  //     const ownerSchool = await school
  //       .findOne({ codeName: getFeedBack.owner.school })
  //       .select("-nameDistricts");
  //     const owner = {
  //       avatarUrl: getFeedBack.owner.avatarUrl.url,
  //       name: getFeedBack.owner.name,
  //       isAdmin: getFeedBack.owner.isAdmin,
  //       _id: getFeedBack.owner._id,
  //       credit: getFeedBack.owner.credit,
  //       email: getFeedBack.owner.email,
  //       school: ownerSchool,
  //       motels: getFeedBack.owner.motels,

  //       rank: getFeedBack.owner.rank,
  //     };
  //     response = { ...getFeedBack._doc, owner: owner };
  //   }
  //   return res.status(200).json({ success: true, data: response });
  // });
  // router.get("/", async (req, res) => {
  //   // if (req.user.isAdmin == false)
  //   //   res.status(400).json({
  //   //     message: "Bạn không đủ quyền hạn",
  //   //   });

  //   const newMotel = await unapprovedMotel.find({}).populate("owner");
  //   const updateMotel = await userUpdateMotel.find({}).populate("user");
  //   const updateRoom = await userUpdateRoom
  //     .find({})
  //     .populate("user")
  //     .populate("motel");
  //   const newPost = await post.find({ valid: false }).populate("owner");
  //   const newFeedBack = await feedBack.find({}).populate("owner");
  //   const allMotel = await motel.find({}).populate("rate.user");
  //   const reports = await report.find({}).populate("owner");
  //   let rates = [];
  //   let responseApprove = [];
  //   for (let i = 0; i < allMotel.length; i++)
  //     for (let j = 0; j < allMotel[i].rate.length; j++)
  //       if (allMotel[i].rate[j].valid == false)
  //         rates.push({
  //           ...allMotel[i].rate[j]._doc,
  //           motel: { id: allMotel[i]._id, name: allMotel[i].name },
  //         });
  //   for (let i = 0; i < rates.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: rates[i].user.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: rates[i].user.avatarUrl.url,
  //       name: rates[i].user.name,
  //       isAdmin: rates[i].user.isAdmin,
  //       _id: rates[i].user.id,
  //       credit: rates[i].user.credit,
  //       email: rates[i].user.email,
  //       //  school: ownerSchool,
  //       motels: rates[i].user.motels,
  //       rank: rates[i].user.rank,
  //     };

  //     responseApprove.push({
  //       title: "Đánh giá " + rates[i].motel.name,
  //       id1: rates[i].motel.id,
  //       id2: rates[i]._id,
  //       createdAt: rates[i].createAt,
  //       type: "rate",
  //       owner: owner,
  //     });
  //   }
  //   for (let i = 0; i < newMotel.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: newMotel[i].owner.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: newMotel[i].owner.avatarUrl.url,
  //       name: newMotel[i].owner.name,
  //       isAdmin: newMotel[i].owner.isAdmin,
  //       _id: newMotel[i].owner.id,
  //       credit: newMotel[i].owner.credit,
  //       email: newMotel[i].owner.email,
  //       // school: ownerSchool,
  //       motels: newMotel[i].owner.motels,
  //       rank: newMotel[i].owner.rank,
  //     };

  //     responseApprove.push({
  //       title: "Nhà trọ mới: " + newMotel[i].name,
  //       id1: newMotel[i]._id,
  //       id2: "",
  //       createdAt: newMotel[i].createdAt,
  //       type: "new-motel",
  //       owner,
  //     });
  //   }
  //   for (let i = 0; i < updateMotel.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: updateMotel[i].user.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: updateMotel[i].user.avatarUrl.url,
  //       name: updateMotel[i].user.name,
  //       isAdmin: updateMotel[i].user.isAdmin,
  //       _id: updateMotel[i].user.id,
  //       credit: updateMotel[i].user.credit,
  //       email: updateMotel[i].user.email,
  //       //  school: ownerSchool,
  //       motels: updateMotel[i].user.motels,
  //       rank: updateMotel[i].user.rank,
  //     };
  //     responseApprove.push({
  //       title: "Sửa thông tin " + updateMotel[i].name,
  //       id1: updateMotel[i]._id,
  //       id2: "",
  //       createdAt: updateMotel[i].createdAt,
  //       type: "motel",
  //       owner,
  //     });
  //   }
  //   for (let i = 0; i < updateRoom.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: updateRoom[i].user.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: updateRoom[i].user.avatarUrl.url,
  //       name: updateRoom[i].user.name,
  //       isAdmin: updateRoom[i].user.isAdmin,
  //       _id: updateRoom[i].user.id,
  //       credit: updateRoom[i].user.credit,
  //       email: updateRoom[i].user.email,
  //       // school: ownerSchool,
  //       motels: updateRoom[i].user.motels,
  //       rank: updateRoom[i].user.rank,
  //     };
  //     let type = "room";

  //     responseApprove.push({
  //       title: "Sửa phòng của " + updateRoom[i].motel.name,
  //       id1: updateRoom[i]._id,
  //       id2: "",
  //       createdAt: updateRoom[i].createdAt,
  //       type: type,
  //       owner,
  //     });
  //   }
  //   for (let i = 0; i < newPost.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: newPost[i].owner.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: newPost[i].owner.avatarUrl.url,
  //       name: newPost[i].owner.name,
  //       isAdmin: newPost[i].owner.isAdmin,
  //       _id: newPost[i].owner.id,
  //       credit: newPost[i].owner.credit,
  //       email: newPost[i].owner.email,
  //       //  school: ownerSchool,
  //       motels: newPost[i].owner.motels,
  //       rank: newPost[i].owner.rank,
  //     };
  //     responseApprove.push({
  //       title: "Bài viết mới: " + newPost[i].title,
  //       id1: newPost[i]._id,
  //       id2: "",
  //       createdAt: newPost[i].createdAt,
  //       type: "post",
  //       owner,
  //     });
  //   }
  //   for (let i = 0; i < newFeedBack.length; i++) {
  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: newFeedBack[i].owner.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: newFeedBack[i].owner.avatarUrl.url,
  //       name: newFeedBack[i].owner.name,
  //       isAdmin: newFeedBack[i].owner.isAdmin,
  //       _id: newFeedBack[i].owner.id,
  //       credit: newFeedBack[i].owner.credit,
  //       email: newFeedBack[i].owner.email,
  //       //   school: ownerSchool,
  //       motels: newFeedBack[i].owner.motels,
  //       rank: newFeedBack[i].owner.rank,
  //     };
  //     responseApprove.push({
  //       title: "Góp ý của " + owner.name,
  //       id1: newFeedBack[i]._id,
  //       id2: "",
  //       createdAt: newFeedBack[i].createdAt,
  //       type: "feedback",
  //       owner,
  //     });
  //   }
  //   for (let i = 0; i < reports.length; i++) {
  //     let type = "";
  //     if (reports[i].type === "rate") type = "Tố cáo đánh giá";
  //     else if (reports[i].type === "post") type = "Tố cáo bài viết";
  //     else if (reports[i].type === "comment") type = "Tố cáo bình luận";

  //     // const ownerSchool = await school
  //     //   .findOne({ codeName: reports[i].owner.school })
  //     //   .select("-nameDistricts");
  //     let owner = {
  //       avatarUrl: reports[i].owner.avatarUrl.url,
  //       name: reports[i].owner.name,
  //       isAdmin: reports[i].owner.isAdmin,
  //       _id: reports[i].owner.id,
  //       credit: reports[i].owner.credit,
  //       email: reports[i].owner.email,
  //       // school: ownerSchool,
  //       motels: reports[i].owner.motels,
  //       rank: reports[i].owner.rank,
  //     };
  //     responseApprove.push({
  //       title: type,
  //       id1: reports[i]._id,
  //       id2: "",
  //       createdAt: reports[i].createdAt,
  //       type: "report",
  //       owner,
  //     });
  //   }
  //   responseApprove = responseApprove.sort((a1, a2) => {
  //     return new Date(a2.createdAt) - new Date(a1.createdAt);
  //   });
  //   const { _order, _sort, _limit, _page, _role, _user, _type, _namelike } =
  //     req.query;
  //   if (typeof _namelike === "string")
  //     responseApprove = responseApprove.filter((item) => {
  //       const test = new RegExp(
  //         removeVietnameseTones(_namelike).toLowerCase(),
  //         "i"
  //       );
  //       return test.test(removeVietnameseTones(item.owner.name.toLowerCase()));
  //     });
  //   if (typeof _role === "string")
  //     if (_role.toLowerCase() === "admin")
  //       responseApprove = responseApprove.filter(
  //         (item) => item.owner.isAdmin == true
  //       );
  //     else if (_role.toLowerCase() === "user")
  //       responseApprove = responseApprove.filter(
  //         (item) => item.owner.isAdmin == false
  //       );
  //   if (typeof _user === "string")
  //     responseApprove = responseApprove.filter(
  //       (item) => item.owner._id == _user
  //     );
  //   if (typeof _type === "string")
  //     responseApprove = responseApprove.filter((item) => item.type == _type);
  //   if (_order && _sort)
  //     if (_sort === "createdat") {
  //       if ((_order = "asc"))
  //         responseApprove = responseApprove.sort((post1, post2) => {
  //           return new Date(post1.createdAt) - new Date(post2.createdAt);
  //         });
  //       else if ((_order = "desc"))
  //         responseApprove = responseApprove.sort((post1, post2) => {
  //           return new Date(post2.createdAt) - new Date(post1.createdAt);
  //         });
  //     }
  //   let limit = responseApprove.length;
  //   let page = 1;
  //   let totalRows = responseApprove.length;
  //   if (_limit && _page != undefined)
  //     if (
  //       typeof parseInt(_limit) === "number" &&
  //       typeof parseInt(_page) === "number"
  //     ) {
  //       limit = parseInt(_limit);
  //       page = parseInt(_page);
  //       responseApprove = responseApprove.slice(
  //         (page - 1) * limit,
  //         limit * page
  //       );
  //     }
  //   return res.status(200).json({
  //     message: "Thành công",
  //     success: true,
  //     data: responseApprove,
  //     pagination: {
  //       _page: page,
  //       _limit: limit,
  //       _totalRows: totalRows,
  //     },
  //   });
  // });
  // router.get("/:type", async (req, res) => {
  //   // type:{motels,posts,rates,reports,feedbacks}
  //   // if (req.user.isAdmin == false)
  //   //   res.status(400).json({
  //   //     message: "Bạn không đủ quyền hạn",
  //   //   });
  //   try {
  //     let rates = [];
  //     let responseApprove = [];

  //     const type = req.params.type;
  //     console.log(type);
  //     if (type) {
  //       if (type === "motels") {
  //         const newMotel = await unapprovedMotel.find({}).populate("owner");
  //         const updateMotel = await userUpdateMotel.find({}).populate("user");
  //         const updateRoom = await userUpdateRoom
  //           .find({})
  //           .populate("user")
  //           .populate("motel");
  //         for (let i = 0; i < newMotel.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: newMotel[i].owner.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: newMotel[i].owner.avatarUrl.url,
  //             name: newMotel[i].owner.name,
  //             isAdmin: newMotel[i].owner.isAdmin,
  //             _id: newMotel[i].owner.id,
  //             credit: newMotel[i].owner.credit,
  //             email: newMotel[i].owner.email,
  //             // school: ownerSchool,
  //             motels: newMotel[i].owner.motels,
  //             rank: newMotel[i].owner.rank,
  //           };

  //           responseApprove.push({
  //             title: "Nhà trọ mới: " + newMotel[i].name,
  //             id1: newMotel[i]._id,
  //             id2: "",
  //             createdAt: newMotel[i].createdAt,
  //             type: "new-motel",
  //             owner,
  //           });
  //         }
  //         for (let i = 0; i < updateMotel.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: updateMotel[i].user.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: updateMotel[i].user.avatarUrl.url,
  //             name: updateMotel[i].user.name,
  //             isAdmin: updateMotel[i].user.isAdmin,
  //             _id: updateMotel[i].user.id,
  //             credit: updateMotel[i].user.credit,
  //             email: updateMotel[i].user.email,
  //             //  school: ownerSchool,
  //             motels: updateMotel[i].user.motels,
  //             rank: updateMotel[i].user.rank,
  //           };
  //           responseApprove.push({
  //             title: "Sửa thông tin " + updateMotel[i].name,
  //             id1: updateMotel[i]._id,
  //             id2: "",
  //             createdAt: updateMotel[i].createdAt,
  //             type: "motel",
  //             owner,
  //           });
  //         }
  //         for (let i = 0; i < updateRoom.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: updateRoom[i].user.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: updateRoom[i].user.avatarUrl.url,
  //             name: updateRoom[i].user.name,
  //             isAdmin: updateRoom[i].user.isAdmin,
  //             _id: updateRoom[i].user.id,
  //             credit: updateRoom[i].user.credit,
  //             email: updateRoom[i].user.email,
  //             // school: ownerSchool,
  //             motels: updateRoom[i].user.motels,
  //             rank: updateRoom[i].user.rank,
  //           };
  //           let type = "room";

  //           responseApprove.push({
  //             title: "Sửa phòng của " + updateRoom[i].motel.name,
  //             id1: updateRoom[i]._id,
  //             id2: "",
  //             createdAt: updateRoom[i].createdAt,
  //             type: type,
  //             owner,
  //           });
  //         }
  //       } else if (type === "posts") {
  //         const newPost = await post.find({ valid: false }).populate("owner");
  //         for (let i = 0; i < newPost.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: newPost[i].owner.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: newPost[i].owner.avatarUrl.url,
  //             name: newPost[i].owner.name,
  //             isAdmin: newPost[i].owner.isAdmin,
  //             _id: newPost[i].owner.id,
  //             credit: newPost[i].owner.credit,
  //             email: newPost[i].owner.email,
  //             //  school: ownerSchool,
  //             motels: newPost[i].owner.motels,
  //             rank: newPost[i].owner.rank,
  //           };
  //           responseApprove.push({
  //             title: "Bài viết mới: " + newPost[i].title,
  //             id1: newPost[i]._id,
  //             id2: "",
  //             createdAt: newPost[i].createdAt,
  //             type: "post",
  //             owner,
  //           });
  //         }
  //       } else if (type === "rates") {
  //         const allMotel = await motel.find({}).populate("rate.user");
  //         for (let i = 0; i < allMotel.length; i++)
  //           for (let j = 0; j < allMotel[i].rate.length; j++)
  //             if (allMotel[i].rate[j].valid == false)
  //               rates.push({
  //                 ...allMotel[i].rate[j]._doc,
  //                 motel: { id: allMotel[i]._id, name: allMotel[i].name },
  //               });
  //         for (let i = 0; i < rates.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: rates[i].user.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: rates[i].user.avatarUrl.url,
  //             name: rates[i].user.name,
  //             isAdmin: rates[i].user.isAdmin,
  //             _id: rates[i].user.id,
  //             credit: rates[i].user.credit,
  //             email: rates[i].user.email,
  //             //  school: ownerSchool,
  //             motels: rates[i].user.motels,
  //             rank: rates[i].user.rank,
  //           };

  //           responseApprove.push({
  //             title: "Đánh giá " + rates[i].motel.name,
  //             id1: rates[i].motel.id,
  //             id2: rates[i]._id,
  //             createdAt: rates[i].createAt,
  //             type: "rate",
  //             owner: owner,
  //           });
  //         }
  //       } else if (type === "feedbacks") {
  //         const newFeedBack = await feedBack.find({}).populate("owner");
  //         for (let i = 0; i < newFeedBack.length; i++) {
  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: newFeedBack[i].owner.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: newFeedBack[i].owner.avatarUrl.url,
  //             name: newFeedBack[i].owner.name,
  //             isAdmin: newFeedBack[i].owner.isAdmin,
  //             _id: newFeedBack[i].owner.id,
  //             credit: newFeedBack[i].owner.credit,
  //             email: newFeedBack[i].owner.email,
  //             //   school: ownerSchool,
  //             motels: newFeedBack[i].owner.motels,
  //             rank: newFeedBack[i].owner.rank,
  //           };
  //           responseApprove.push({
  //             title: "Góp ý của " + owner.name,
  //             id1: newFeedBack[i]._id,
  //             id2: "",
  //             createdAt: newFeedBack[i].createdAt,
  //             type: "feedback",
  //             owner,
  //           });
  //         }
  //       } else if (type === "reports") {
  //         const reports = await report.find({}).populate("owner");
  //         for (let i = 0; i < reports.length; i++) {
  //           let type = "";
  //           if (reports[i].type === "rate") type = "Tố cáo đánh giá";
  //           else if (reports[i].type === "post") type = "Tố cáo bài viết";
  //           else if (reports[i].type === "comment") type = "Tố cáo bình luận";

  //           // const ownerSchool = await school
  //           //   .findOne({ codeName: reports[i].owner.school })
  //           //   .select("-nameDistricts");
  //           let owner = {
  //             avatarUrl: reports[i].owner.avatarUrl.url,
  //             name: reports[i].owner.name,
  //             isAdmin: reports[i].owner.isAdmin,
  //             _id: reports[i].owner.id,
  //             credit: reports[i].owner.credit,
  //             email: reports[i].owner.email,
  //             // school: ownerSchool,
  //             motels: reports[i].owner.motels,
  //             rank: reports[i].owner.rank,
  //           };
  //           responseApprove.push({
  //             title: type,
  //             id1: reports[i]._id,
  //             id2: "",
  //             createdAt: reports[i].createdAt,
  //             type: "report",
  //             owner,
  //           });
  //         }
  //       }
  //     }

  //     responseApprove = responseApprove.sort((a1, a2) => {
  //       return new Date(a2.createdAt) - new Date(a1.createdAt);
  //     });
  //     const { _order, _sort, _limit, _page, _role, _user, _type, _namelike } =
  //       req.query;
  //     if (typeof _namelike === "string")
  //       responseApprove = responseApprove.filter((item) => {
  //         const test = new RegExp(
  //           removeVietnameseTones(_namelike).toLowerCase(),
  //           "i"
  //         );
  //         return test.test(
  //           removeVietnameseTones(item.owner.name.toLowerCase())
  //         );
  //       });
  //     if (typeof _role === "string")
  //       if (_role.toLowerCase() === "admin")
  //         responseApprove = responseApprove.filter(
  //           (item) => item.owner.isAdmin == true
  //         );
  //       else if (_role.toLowerCase() === "user")
  //         responseApprove = responseApprove.filter(
  //           (item) => item.owner.isAdmin == false
  //         );
  //     if (typeof _user === "string")
  //       responseApprove = responseApprove.filter(
  //         (item) => item.owner._id == _user
  //       );
  //     if (typeof _type === "string")
  //       responseApprove = responseApprove.filter((item) => item.type == _type);
  //     if (_order && _sort)
  //       if (_sort === "createdat") {
  //         if ((_order = "asc"))
  //           responseApprove = responseApprove.sort((post1, post2) => {
  //             return new Date(post1.createdAt) - new Date(post2.createdAt);
  //           });
  //         else if ((_order = "desc"))
  //           responseApprove = responseApprove.sort((post1, post2) => {
  //             return new Date(post2.createdAt) - new Date(post1.createdAt);
  //           });
  //       }
  //     let limit = responseApprove.length;
  //     let page = 1;
  //     let totalRows = responseApprove.length;
  //     if (_limit && _page != undefined)
  //       if (
  //         typeof parseInt(_limit) === "number" &&
  //         typeof parseInt(_page) === "number"
  //       ) {
  //         limit = parseInt(_limit);
  //         page = parseInt(_page);
  //         responseApprove = responseApprove.slice(
  //           (page - 1) * limit,
  //           limit * page
  //         );
  //       }
  //     return res.status(200).json({
  //       message: "Thành công",
  //       success: true,
  //       data: responseApprove,
  //       pagination: {
  //         _page: page,
  //         _limit: limit,
  //         _totalRows: totalRows,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Lỗi không xác định", success: false });
  //   }
  // });
  return router;
};
module.exports = approveRouter;
