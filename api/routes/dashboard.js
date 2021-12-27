const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const post = require("../models/post");
const user = require("../models/user");
const approval = require("../models/approval");
const router = express.Router();
const online = require("../online");
const access = require("../models/access");
const mongoose = require("mongoose");
const db = mongoose.connection;
const report = require("../models/report");
const unapprovedMotel = require("../models/unapproved-motel");
const userUpdateMotel = require("../models/user-update-motel");

const comment = require("../models/comment");
const dashboardRoute = (io) => {
  router.get("/statisticals", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const quantityAccount = await user.count({ deleted: false });

      const quantityMotel = await motel.find({}).select("rate");
      const quantityPost = await post.find({ valid: true });
      const currDate = new Date();
      const quantityAccessingCurrMonth = await access
        .findOne({
          year: currDate.getFullYear(),
          month: currDate.getMonth() + 1,
        })
        .select("quantity");
      // const getCountRateMotel = await motel.find({}).select("rate");
      let rateCount = 0;
      for (let i = 0; i < quantityMotel.length; i++) {
        for (let j = 0; j < quantityMotel[i].rate.length; j++) {
          if (quantityMotel[i].rate[j].valid == false) rateCount++;
        }
      }

      const counts = await Promise.all([
        unapprovedMotel.count().exec(),
        userUpdateMotel.count().exec(),
        post.count({ valid: false }).exec(),
      ]);
      let sum =
        counts.reduce((partial_sum, a) => partial_sum + a, 0) + rateCount;
      const reports = await report.find();
      const comments = await comment.find();
      let countReport = 0;
      for (let i = 0; i < reports.length; i++) {
        let getData;
        if (reports[i].type === "rate")
          getData = quantityMotel.find((item) => {
            return (
              item.rate.some(
                (r) => JSON.stringify(r._id) === JSON.stringify(reports[i].id2)
              ) && JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
            );
          });
        else if (reports[i].type === "post")
          getData = quantityPost.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
          );
        else if (reports[i].type === "comment")
          getData = comments.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
          );

        if (getData) countReport = countReport + 1;
      }
      res.status(200).json({
        data: {
          account: quantityAccount,
          motel: quantityMotel.length,
          approval: sum + countReport,
          access: quantityAccessingCurrMonth.quantity,
          post: quantityPost.length,
        },
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });

  router.get("/recents", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const users = await user
        .find({})
        .select(
          "-notify -refreshToken -username -email -unsignedName -password -favorite -deleted "
        );
      const motels = await motel
        .find({})
        .select("-editor -rate")
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      const waitingMotels = await unapprovedMotel
        .find({})
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      let recentActivities = [];
      for (let i = 0; i < users.length; i++) {
        const done = users[i].done.map((item) => {
          let title = item.title;

          title =
            item.title[0].toLowerCase() + title.substring(1, title.length);

          return { ...item._doc, title: users[i].name + " " + title };
        });
        for (let j = 0; j < done.length; j++)
          recentActivities = [
            ...recentActivities,
            {
              ...done[j],
              owner: {
                ...users[i]._doc,
                avatarUrl: users[i].avatarUrl.url,
                done: undefined,
                totalLikes: users[i].likes.length,
              },
            },
          ];
      }
      let recentMotels = [];
      for (let i = 0; i < motels.length; i++) {
        recentMotels.push({
          ...motels[i]._doc,
          thumbnail: motels[i].thumbnail.url,
          images: motels[i].images.map((item) => item.url),
          owner: {
            ...motels[i].owner._doc,
            avatarUrl: motels[i].owner.avatarUrl.url,
            totalLikes: motels[i].owner.likes.length,
          },
          type: "Đang hoạt động",
        });
      }
      for (let i = 0; i < waitingMotels.length; i++) {
        recentMotels.push({
          ...waitingMotels[i]._doc,
          thumbnail: waitingMotels[i].thumbnail.url,
          images: waitingMotels[i].images.map((item) => item.url),
          owner: {
            ...waitingMotels[i].owner._doc,
            avatarUrl: waitingMotels[i].owner.avatarUrl.url,
            totalLikes: waitingMotels[i].owner.likes.length,
          },
          type: "Đang chờ duyệt",
        });
      }
      res.status(200).json({
        success: true,
        data: {
          activities: recentActivities.sort(
            (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
          ),
          motels: recentMotels.sort(
            (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
          ),
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });

  // router.get("/subjects", verifyToken, async (req, res) => {
  //   if (req.user.isAdmin == false)
  //     return res
  //       .status(403)
  //       .json({ message: "Bạn không có quyền", success: false });
  //   try {
  //     const posts = await post.find({ valid: true }).select("_id subject");
  //     const subjects = [
  //       {
  //         _id: "6173ba553c954151dcc8fdf7",
  //         name: "Tìm nhà trọ",
  //         quantity: posts.filter(
  //           (item) =>
  //             JSON.stringify(item.subject) ===
  //             JSON.stringify("6173ba553c954151dcc8fdf7")
  //         ).length,
  //       },
  //       {
  //         _id: "6173ba553c954151dcc8fdf8",
  //         name: "Tìm bạn ở ghép",
  //         quantity: posts.filter(
  //           (item) =>
  //             JSON.stringify(item.subject) ===
  //             JSON.stringify("6173ba553c954151dcc8fdf8")
  //         ).length,
  //       },
  //       {
  //         _id: "6173ba553c954151dcc8fdf9",
  //         name: "Đánh giá nhà trọ",
  //         quantity: posts.filter(
  //           (item) =>
  //             JSON.stringify(item.subject) ===
  //             JSON.stringify("6173ba553c954151dcc8fdf9")
  //         ).length,
  //       },
  //     ];
  //     res.status(200).json({
  //       data: { subjects: subjects, total: posts.length },
  //       success: true,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Lỗi không xác định" });
  //   }
  // });
  router.get("/lists", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      let responseOnline = online.getUsers(1, -1);
      const importantUsers = await user
        .find({
          $and: [
            {
              deleted: false,
            },
            {
              $or: [{ isAdmin: true }, { credit: { $gt: 200 } }],
            },
          ],
        })
        .select(
          "-notify -refreshToken -done  -unsignedName -password -favorite -deleted"
        );
      const approvals = await approval
        .find({})
        .sort({ createdAt: -1 })
        .populate(
          "user",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      res.status(200).json({
        data: {
          approvals: approvals.map((item) => {
            return {
              ...item._doc,
              owner: {
                ...item.owner._doc,
                avatarUrl: item.owner.avatarUrl.url,
                totalLikes: item.owner.likes.length,
              },
            };
          }),
          ononlines: responseOnline,
          importantUsers: importantUsers.map((item) => {
            return { ...item._doc, avatarUrl: item.avatarUrl.url };
          }),
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });
  router.get("/charts", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const listApproval = await approval.find().select("_id createdAt type");
      const allAccount = await user
        .find({ deleted: false })
        .select("_id createdAt");
      let listQuantityApprovalMotel = [];
      let listQuantityApprovalPost = [];
      let listQuantityAccount = [];
      for (let i = 0; i < allAccount.length; i++) {
        const time = allAccount[i].createdAt;
        const createdAt = {
          year: time.getFullYear(),
          month: time.getMonth() + 1,
        };
        if (
          !listQuantityAccount.some(
            (item) =>
              item.createdAt.year == createdAt.year &&
              item.createdAt.month == createdAt.month
          )
        )
          listQuantityAccount.push({
            createdAt: { ...createdAt },
            quantity: allAccount.filter(
              (item) =>
                item.createdAt.getMonth() + 1 == createdAt.month &&
                item.createdAt.getFullYear() == createdAt.year
            ).length,
          });
      }
      for (let i = 0; i < listApproval.length; i++) {
        if (listApproval[i].type === "motel") {
          const time = listApproval[i].createdAt;
          const createdAt = {
            year: time.getFullYear(),
            month: time.getMonth() + 1,
          };
          if (
            !listQuantityApprovalMotel.some(
              (item) =>
                item.createdAt.year == createdAt.year &&
                item.createdAt.month == createdAt.month
            )
          )
            listQuantityApprovalMotel.push({
              createdAt: { ...createdAt },
              quantity: listApproval.filter(
                (item) =>
                  item.type === "motel" &&
                  item.createdAt.getMonth() + 1 == createdAt.month &&
                  item.createdAt.getFullYear() == createdAt.year
              ).length,
            });
        } else listApproval[i].type === "post";
        {
          const time = listApproval[i].createdAt;
          const createdAt = {
            year: time.getFullYear(),
            month: time.getMonth() + 1,
          };
          if (
            !listQuantityApprovalPost.some(
              (item) =>
                item.createdAt.year == createdAt.year &&
                item.createdAt.month == createdAt.month
            )
          )
            listQuantityApprovalPost.push({
              createdAt: { ...createdAt },
              quantity: listApproval.filter(
                (item) =>
                  item.type === "motel" &&
                  item.createdAt.getMonth() + 1 == createdAt.month &&
                  item.createdAt.getFullYear() == createdAt.year
              ).length,
            });
        }
      }
      res.status(200).json({
        data: {
          account: listQuantityAccount,
          approvalMotel: listQuantityApprovalMotel,
          approvalPost: listQuantityApprovalPost,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });
  router.get("/stats", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    const posts = await post.find({ valid: true }).select("_id subject");
    const subjects = [
      {
        _id: "6173ba553c954151dcc8fdf7",
        name: "Tìm nhà trọ",
        quantity: posts.filter(
          (item) =>
            JSON.stringify(item.subject) ===
            JSON.stringify("6173ba553c954151dcc8fdf7")
        ).length,
      },
      {
        _id: "6173ba553c954151dcc8fdf8",
        name: "Tìm bạn ở ghép",
        quantity: posts.filter(
          (item) =>
            JSON.stringify(item.subject) ===
            JSON.stringify("6173ba553c954151dcc8fdf8")
        ).length,
      },
      {
        _id: "6173ba553c954151dcc8fdf9",
        name: "Đánh giá nhà trọ",
        quantity: posts.filter(
          (item) =>
            JSON.stringify(item.subject) ===
            JSON.stringify("6173ba553c954151dcc8fdf9")
        ).length,
      },
    ];
    db.db.stats(function (err, stats) {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Lỗi không xác định" });
      } else {
        const dataSize = (stats.dataSize + stats.indexSize) / 1024;
        const totalSize = 512 * 1024;
        const rate = 100 * (dataSize / totalSize);
        res.status(200).json({
          success: true,
          data: {
            size: { dataSize, totalSize, rate },
            subjects,
          },
        });
      }
    });
  });
  // router.get("/list-approvals", verifyToken, async (req, res) => {
  //   if (req.user.isAdmin == false)
  //     return res
  //       .status(403)
  //       .json({ message: "Bạn không có quyền", success: false });
  //   try {
  //     const approvals = await approval
  //       .find({})
  //       .sort({ createdAt: -1 })
  //       .populate(
  //         "user",
  //         "-notify -refreshToken -done -username -email -unsignedName -password -favorite -deleted -province -district"
  //       )
  //       .populate(
  //         "owner",
  //         "-notify -refreshToken -done -username -email -unsignedName -password -favorite -deleted -province -district"
  //       );
  //     const { _page, _limit } = req.query;
  //     let page = 1,
  //       limit = approvals.length;
  //     if (!isNaN(parseInt(_page))) {
  //       page = parseInt(_page);
  //     }
  //     if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
  //     let responseApprovals = [...approvals].map((item) => {
  //       return {
  //         ...item._doc,
  //         user: { ...item.user._doc, avatarUrl: item.user.avatarUrl.url },
  //         owner: {
  //           ...item.owner._doc,
  //           avatarUrl: item.owner.avatarUrl.url,
  //         },
  //         content: item.content + item.user.name,
  //       };
  //     });
  //     responseApprovals = responseApprovals.slice(
  //       (page - 1) * limit,
  //       page * limit
  //     );
  //     res.status(200).json({ success: true, data: responseApprovals });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Lỗi không xác định", success: false });
  //   }
  // });
  // router.get("/list-important-users", verifyToken, async (req, res) => {
  //   if (req.user.isAdmin == false)
  //     return res
  //       .status(403)
  //       .json({ message: "Bạn không có quyền", success: false });
  //   try {
  //     const users = await user
  //       .find({
  //         deleted: false,
  //         $or: [{ credit: { $gt: 99 } }, { isAdmin: true }],
  //       })
  //       .select(
  //         "-notify -refreshToken -username -email -unsignedName -password -favorite -deleted -province -district"
  //       );
  //     const { _page, _limit } = req.query;
  //     let page = 1,
  //       limit = users.length;
  //     if (!isNaN(parseInt(_page))) {
  //       page = parseInt(_page);
  //     }
  //     if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
  //     let responseUsers = [...users].map((item) => {
  //       return { ...item._doc, avatarUrl: item.avatarUrl.url };
  //     });
  //     responseUsers = responseUsers.slice((page - 1) * limit, page * limit);
  //     res.status(200).json({ success: true, data: responseUsers });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Lỗi không xác định" });
  //   }
  // });
  // router.get("/list-ononlines", verifyToken, (req, res) => {
  //   if (req.user.isAdmin == false)
  //     return res
  //       .status(403)
  //       .json({ message: "Bạn không có quyền", success: false });
  //   try {
  //     const { _page, _limit, _role } = req.query;

  //     let page = 1,
  //       limit = -1;
  //     if (!isNaN(parseInt(_page))) {
  //       page = parseInt(_page);
  //     }
  //     if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
  //     let responseOnline = online.getUsers(page, limit);
  //     if (_role)
  //       responseOnline.list = responseOnline.list.filter((item) => {
  //         let role = false;
  //         if (_role.toLowerCase() === "admin") role = true;
  //         return item.isAdmin == role;
  //       });
  //     res.status(200).json({ success: true, data: responseOnline });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Lỗi không xác định" });
  //   }
  // });
  return router;
};

module.exports = dashboardRoute;
