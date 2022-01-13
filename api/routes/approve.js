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
const approvalStat = require("../utils/approvalStat");
const add = require("../utils/done");
const subject = require("../models/subject");
const user = require("../models/user");
const approveRouter = (io) => {
  //working
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
      const updateMotel = await userUpdateMotel
        .findByIdAndDelete(id)
        .populate("motel");
      for (let i = 0; i < updateMotel.images.length; i++) {
        if (
          !updateMotel.motel.images.some(
            (item) => item.public_id === updateMotel.images[i].public_id
          )
        )
          await upload.unlink(updateMotel.images[i].public_id);
      }
      if (
        updateMotel.thumbnail.public_id !==
        updateMotel.motel.thumbnail.public_id
      )
        await upload.unlink(updateMotel.thumbnail.public_id);
    }
    res.status(200).json({ success: true, message: "Thành công" });
    io.sendDashboardRecent("motels");
    io.sendDashboardStatisticals("motels");
  });
  /*
  //working
  router.patch("/motels/:id", verifyToken, async (req, res) => {
    //duyệt motel update\
    try {
      const getNewUpdateMotel = await userUpdateMotel
        .findById(req.params.id)
        .populate("motel");
      const oldMotel = getNewUpdateMotel.motel;
      let userAtr = getNewUpdateMotel.user;

      let edited = "Chỉnh sửa nhà trọ: ";
      if (oldMotel.name !== getNewUpdateMotel.name) edited += "tên nhà trọ";

      if (oldMotel.thumbnail.public_id != getNewUpdateMotel.thumbnail.public_id)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "ảnh bìa";
        else edited += ", ảnh bìa";
      if (getNewUpdateMotel.address !== oldMotel.address)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "địa chỉ";
        else edited += ", địa chỉ";
      if (getNewUpdateMotel.desc !== oldMotel.desc)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "giới thiệu";
        else edited += ", giới thiệu";

      if (
        oldMotel.contact.zalo !== getNewUpdateMotel.contact.zalo ||
        oldMotel.contact.phone !== getNewUpdateMotel.contact.phone ||
        oldMotel.contact.facebook !== getNewUpdateMotel.contact.facebook ||
        oldMotel.contact.email !== getNewUpdateMotel.contact.email
      )
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "thông tin liên hệ";
        else edited += ", thông tin liên hệ";

      if (getNewUpdateMotel.status !== getNewUpdateMotel.status)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "trang thái";
        else edited += ", trạng thái";
      if (oldMotel.available != getNewUpdateMotel.available)
        if (edited === "Chỉnh sửa nhà trọ: ") edited += "phòng trống";
        else edited += ", phòng trống";

      for (let i = 0; i < getNewUpdateMotel.school.length; i++) {
        if (
          !getNewUpdateMotel.school.some((item) => {
            JSON.stringify(item) === JSON.stringify(oldMotel.school[i]._id);
          })
        ) {
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "lân cận";
          else edited += ", lân cận";
          break;
        }
      }

      if (oldMotel.editor.length >= 3) oldMotel.editor.shift();
      oldMotel.editor.push({
        user: userAtr,
        edited: edited,
        createdAt: Date.now(),
      });
      const updateProps = {
        name: getNewUpdateMotel.name,
        thumbnail: getNewUpdateMotel.thumbnail,
        images: getNewUpdateMotel.images,
        address: getNewUpdateMotel.address,
        desc: getNewUpdateMotel.desc,
        contact: getNewUpdateMotel.contact,
        status: getNewUpdateMotel.status,
        school: getNewUpdateMotel.school,
        available: getNewUpdateMotel.available,
        editor: oldMotel.editor,
      };
      await motel.findByIdAndUpdate(oldMotel._id, { $set: updateProps });

      res.status(200).json({ message: "Thành công", success: true });
      io.notifyToUser(getNewUpdateMotel.user, {
        message: `Chúng tôi đã duyệt thông tin chỉnh sửa nhà trọ. Chân thành cám ơn sự đóng góp của bạn`,
        url: `/motels/${oldMotel._id}`,
        imageUrl:
          "http://res.cloudinary.com/dpregsdt9/image/upload/v1639808792/notify/dpebhnmfzkxu6ojekj3r.png",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  */
  //good
  router.post("/motels/:id", verifyToken, async (req, res) => {
    // duyệt nhà trọ mới
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    let type = "add";
    const checkMotel = await unapprovedMotel.findById(req.params.id);
    if (!checkMotel) type = "update";
    const getNewUpdateMotel = await userUpdateMotel
      .findById(req.params.id)
      .populate("motel");
    if (!getNewUpdateMotel && !checkMotel)
      return res
        .status(400)
        .json({ message: "Không tìm thấy thông tin mới", success: false });
    if (type === "add")
      try {
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
        await unapprovedMotel.findByIdAndDelete(req.params.id);
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
        user.findByIdAndUpdate(newMotel.owner, { $inc: { motels: 1 } });

        res.status(200).json({ message: "Duyệt thành công", success: true });
        io.sendDashboardRecent("motels");
        await unapprovedMotel.findByIdAndDelete(req.params.id);
        add(
          newMotel.owner,
          "Đăng nhà trọ mới",
          {
            type: "createdMotel",
            motelId: newMotel._id,
            desc: newMotel.desc,
            name: newMotel.name,
          },
          io
        );
        io.sendDashboardStatisticals("motels");
        approvalStat.addMotelApproval(
          newMotel._id,
          `"${newMotel.name}" của `,
          req.user.id,
          newMotel.owner
        );
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Lỗi không xác định" });
      }
    else if (type === "update")
      try {
        const oldMotel = getNewUpdateMotel.motel;
        let userAtr = getNewUpdateMotel.user;

        let edited = "Chỉnh sửa nhà trọ: ";
        if (oldMotel.name !== getNewUpdateMotel.name) edited += "tên nhà trọ";

        if (
          oldMotel.thumbnail.public_id != getNewUpdateMotel.thumbnail.public_id
        )
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "ảnh bìa";
          else edited += ", ảnh bìa";
        if (getNewUpdateMotel.address !== oldMotel.address)
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "địa chỉ";
          else edited += ", địa chỉ";
        if (getNewUpdateMotel.desc !== oldMotel.desc)
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "giới thiệu";
          else edited += ", giới thiệu";

        if (
          oldMotel.contact.zalo !== getNewUpdateMotel.contact.zalo ||
          oldMotel.contact.phone !== getNewUpdateMotel.contact.phone ||
          oldMotel.contact.facebook !== getNewUpdateMotel.contact.facebook ||
          oldMotel.contact.email !== getNewUpdateMotel.contact.email
        )
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "thông tin liên hệ";
          else edited += ", thông tin liên hệ";

        if (getNewUpdateMotel.status !== getNewUpdateMotel.status)
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "trang thái";
          else edited += ", trạng thái";
        if (oldMotel.available != getNewUpdateMotel.available)
          if (edited === "Chỉnh sửa nhà trọ: ") edited += "phòng trống";
          else edited += ", phòng trống";

        for (let i = 0; i < getNewUpdateMotel.school.length; i++) {
          if (
            !getNewUpdateMotel.school.some((item) => {
              JSON.stringify(item) === JSON.stringify(oldMotel.school[i]._id);
            })
          ) {
            if (edited === "Chỉnh sửa nhà trọ: ") edited += "lân cận";
            else edited += ", lân cận";
            break;
          }
        }

        if (oldMotel.editor.length >= 3) oldMotel.editor.shift();
        oldMotel.editor.push({
          user: userAtr,
          edited: edited,
          createdAt: Date.now(),
        });
        const updateProps = {
          name: getNewUpdateMotel.name,
          thumbnail: getNewUpdateMotel.thumbnail,
          images: getNewUpdateMotel.images,
          address: getNewUpdateMotel.address,
          desc: getNewUpdateMotel.desc,
          contact: getNewUpdateMotel.contact,
          status: getNewUpdateMotel.status,
          school: getNewUpdateMotel.school,
          available: getNewUpdateMotel.available,
          editor: oldMotel.editor,
        };
        await motel.findByIdAndUpdate(oldMotel._id, { $set: updateProps });
        await userUpdateMotel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Thành công", success: true });
        io.notifyToUser(getNewUpdateMotel.user, {
          message: `Chúng tôi đã duyệt thông tin chỉnh sửa nhà trọ. Chân thành cám ơn sự đóng góp của bạn`,
          url: `/motels/${oldMotel._id}`,
          imageUrl:
            "http://res.cloudinary.com/dpregsdt9/image/upload/v1639808792/notify/dpebhnmfzkxu6ojekj3r.png",
        });
        approvalStat.addUpdateMotelApproval(
          getNewUpdateMotel._id,
          `"${getNewUpdateMotel.name}" của `,
          req.user.id,
          userAtr
        );
        add(
          userAtr,
          "Chỉnh sửa nhà trọ",
          {
            type: "updatedMotel",
            motelId: getNewUpdateMotel._id,
            edited: edited,
            name: getNewUpdateMotel.name,
          },
          io
        );
      } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Lỗi không xác định", success: false });
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
        .populate(
          "user",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");
      if (!newMotel)
        return res.status(400).json({
          message: "Không tìm thấy thông tin cập nhật",
          success: false,
        });
      const oldMotel = await motel
        .findById(newMotel.motel)
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
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
          totalLikes: oldMotel.owner.likes.length,
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

          totalLikes: newMotel.user.likes.length,
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
        .populate(
          "user",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .select("-unsignedName -rate")
        .populate("school", "-nameDistricts");
      const newMotel = await unapprovedMotel
        .find()
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
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
            totalLikes: arrayAll[i].user.likes.length,
          };
        else
          owner = {
            ...arrayAll[i].owner._doc,
            avatarUrl: arrayAll[i].owner.avatarUrl.url,
            totalLikes: arrayAll[i].owner.likes.length,
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
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
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
          school: rates[i].user.school,
          motels: rates[i].user.motels,
          rank: rates[i].user.rank,
          totalLikes: rates[i].user.likes.length,
          posts: rates[i].user.posts,
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
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
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
                totalLikes: getReports[i].owner.likes.length,
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
      if (!approvePost)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin", success: false });
      io.notifyToUser(approvePost.owner, {
        message: `Bài viết của bạn đã được duyệt`,
        url: `/posts/${approvePost._id}`,
        imageUrl:
          "https://res.cloudinary.com/dpregsdt9/image/upload/v1639490398/notify/verified_rrd4yn.png",
      });
      res.status(200).json({ message: "Đã duyệt bài viết", success: true });
      approvalStat.addPostApproval(
        approvePost._id,
        `Bài viết "${approvePost.title}" của `,
        req.user.id,
        approvePost.owner
      );
      add(
        approvePost.owner,
        "Đăng bài viết mới",
        {
          type: "createdPost",
          subjectId: approvePost.subject,
          title: approvePost.title,
          content: approvePost.content,
          postId: approvePost._id,
        },
        io
      );
      user.findByIdAndUpdate(approvePost.owner, {
        $inc: { posts: 1 },
      });
      subject.findByIdAndUpdate(approvePost.subject, {
        $inc: { posts: 1 },
      });

      io.sendDashboardStatisticals("posts");
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
          "avatarUrl name isAdmin _id credit email posts motels rank likes school"
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
              totalLikes: getPosts[i].owner.likes.length,
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
  router.post("/rates/:id", verifyToken, async (req, res) => {
    // Duyệt đánh giá
    if (req.user.isAdmin == false)
      res.status(403).json({
        message: "Bạn không đủ quyền hạn",
      });
    try {
      const id = req.params.id;
      const approveRate = await motel.findOneAndUpdate(
        { "rate._id": id, "rate.valid": false },
        { $set: { "rate.$.valid": true } }
      );
      const findRate = approveRate.rate.find(
        (item) => JSON.stringify(id) === JSON.stringify(item._id)
      );
      if (!approveRate)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin", success: false });
      if (!findRate)
        return res
          .status(400)
          .json({ message: "Không tìm thấy thông tin", success: false });
      res.status(200).json({ message: "Thành công", success: true });
      await motel.findOneAndUpdate(
        { _id: approveRate._id },
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

      approvalStat.addPostApproval(
        approveRate._id,
        `Đánh giá về "${approveRate.name}" của `,
        req.user.id,
        findRate.user
      );
      add(
        req.user.id,
        "Đánh giá nhà trọ",
        {
          type: "rating",
          motelId: approveRate._id,
          content: findRate.content,
          star: findRate.star,
        },
        io
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
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
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
          school: rates[i].user.school,
          motels: rates[i].user.motels,
          rank: rates[i].user.rank,
          totalLikes: rates[i].user.likes.length,
          posts: rates[i].user.posts,
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

  return router;
};
module.exports = approveRouter;
