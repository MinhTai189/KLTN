const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const user = require("../models/user");
const router = express.Router();

const notifyRouter = (io) => {
  router.delete("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    await user.findOneAndUpdate(
      { _id: req.user.id, deleted: false },
      {
        $pull: {
          notify: { _id: id },
        },
      }
    );
    return res.status(200).json({ message: "Xóa thành công", success: true });
  });
  router.patch("/read/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    await user.findOneAndUpdate(
      { _id: req.user.id, deleted: false, "notify._id": id },
      {
        $set: {
          "notify.$.read": true,
        },
      }
    );
    return res.status(200).json({ message: "Thành công", success: true });
  });
  router.patch("/read-all/", verifyToken, async (req, res) => {
    const getUser = await user.findById(req.user.id);
    await user.findOneAndUpdate(
      { _id: req.user.id, deleted: false },
      {
        $set: {
          notify: getUser.notify.map((item) => {
            return { ...item, read: true };
          }),
        },
      }
    );
    return res.status(200).json({ message: "Thành công", success: true });
  });
  router.get("/", verifyToken, async (req, res) => {
    try {
      const getUser = await user.findById(req.user.id);
      const { _page, _limit, _read } = req.query;
      if (!getUser)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      let responseNotify = [...getUser.notify].sort((n1, n2) => {
        return new Date(n2.createdAt) - new Date(n1.createdAt);
      });
      let read = responseNotify.filter((item) => item.read == true).length,
        unread = responseNotify.filter((item) => item.read == false).length;
      if (Array.isArray(_read))
        if (
          (_read[0].toLowerCase() === "true" ||
            _read[0].toLowerCase() === "false") &&
          (_read[1].toLowerCase() === "true" ||
            _read[1].toLowerCase() === "false")
        ) {
          if (_read[0].toLowerCase() === "false")
            responseNotify = responseNotify.filter((item) => {
              return item.read == false;
            });
          if (_read[1].toLowerCase() === "false")
            responseNotify = responseNotify.filter((item) => {
              return item.read == true;
            });
        }
      let page = 1,
        limit = responseNotify.length,
        totalRows = responseNotify.length;

      if (!isNaN(parseInt(_page)) && !isNaN(parseInt(_limit))) {
        page = parseInt(_page);
        limit = parseInt(_limit);
      }
      responseNotify = responseNotify.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        data: { notify: responseNotify, read, unread },
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

module.exports = notifyRouter;
