const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const post = require("../models/post");
const user = require("../models/user");
const approval = require("../models/approval");
const router = express.Router();
const online = require("../online");
const access = require("../models/access");

const dashboardRoute = (io) => {
  router.get("/statisticals", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const quantityAccount = await user.count({ deleted: false });
      const quantityApproval = await approval.count({});
      const quantityMotel = await motel.count({});
      const currDate = new Date();
      const quantityAccessingCurrMonth = await access
        .findOne({
          year: currDate.getFullYear(),
          month: currDate.getMonth() + 1,
        })
        .select("quantity");
      res.status(200).json({
        data: {
          account: quantityAccount,
          motel: quantityMotel,
          approval: quantityApproval,
          access: quantityAccessingCurrMonth.quantity,
        },
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });
  router.get("/list-approvals", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const approvals = await approval
        .find({})
        .sort({ createdAt: -1 })
        .populate(
          "user",
          "-notify -refreshToken -done -username -email -unsignedName -password -favorite -deleted -province -district"
        )
        .populate(
          "owner",
          "-notify -refreshToken -done -username -email -unsignedName -password -favorite -deleted -province -district"
        );
      const { _page, _limit } = req.query;
      let page = 1,
        limit = approvals.length;
      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      let responseApprovals = [...approvals].map((item) => {
        return {
          ...item._doc,
          user: { ...item.user._doc, avatarUrl: item.user.avatarUrl.url },
          owner: {
            ...item.owner._doc,
            avatarUrl: item.owner.avatarUrl.url,
          },
          content: item.content + item.user.name,
        };
      });
      responseApprovals = responseApprovals.slice(
        (page - 1) * limit,
        page * limit
      );
      res.status(200).json({ success: true, data: responseApprovals });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  router.get("/recents", async (req, res) => { });
  router.get("/list-important-users", verifyToken, async (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const users = await user
        .find({
          deleted: false,
          $or: [{ credit: { $gt: 99 } }, { isAdmin: true }],
        })
        .select(
          "-notify -refreshToken -username -email -unsignedName -password -favorite -deleted -province -district"
        );
      const { _page, _limit } = req.query;
      let page = 1,
        limit = users.length;
      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      let responseUsers = [...users].map((item) => {
        return { ...item._doc, avatarUrl: item.avatarUrl.url };
      });
      responseUsers = responseUsers.slice((page - 1) * limit, page * limit);
      res.status(200).json({ success: true, data: responseUsers });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định" });
    }
  });
  router.get("/list-ononlines", verifyToken, (req, res) => {
    if (req.user.isAdmin == false)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền", success: false });
    try {
      const { _page, _limit } = req.query;
      let page = 1,
        limit = -1;
      if (!isNaN(parseInt(_page))) {
        page = parseInt(_page);
      }
      if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
      let responseOnline = online.getUsers(page, limit);
      res.status(200).json({ success: true, data: responseOnline });
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
  return router;
};

module.exports = dashboardRoute;
