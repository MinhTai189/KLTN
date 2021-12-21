const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const post = require("../models/post");
const user = require("../models/user");
const approval = require("../models/approval");
const router = express.Router();

const statisticalRoute = (io) => {
  router.get("/statistical", (req, res) => {});
  router.get("/approvals", (req, res) => {});
  router.get("/recents", (req, res) => {});
  router.get("/lists", (req, res) => {});
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

module.exports = statisticalRoute;
