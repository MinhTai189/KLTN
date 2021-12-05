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
    const id = req.params.id;
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
  return router;
};

module.exports = notifyRouter;
