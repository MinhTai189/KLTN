const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const motel = require("../models/motel");
const userUpdateRoom = require("../models/user-update-room");

router.post("/:id", verifyToken, async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      success: false,
      message: "Không nhận được nhà trọ cần cập nhật",
    });
  const id = req.params.id;
  let { optional, price, area, total, remain, status } = req.body;

  if (
    Array.isArray(optional) == false ||
    typeof price !== "number" ||
    typeof area !== "object" ||
    typeof total !== "number" ||
    typeof remain !== "number" ||
    typeof status !== "boolean"
  ) {
    return res.status(400).json({ success: false, message: "Sai dữ liệu" });
  }
  let optionalFixed = {
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
  for (let i = 0; i < optional.length; i++) {
    optionalFixed[optional[i]] = true;
  }
  if (req.user.isAdmin == true)
    try {
      const motelUpdate = await motel.findById(id);
      motelUpdate.room.push({
        optional: optionalFixed,
        area,
        price,
        total,
        remain,
      });
      await motelUpdate.save();
      let edited = "Thêm phòng trọ mới";
      if (motelUpdate.editor.length >= 3) motelUpdate.editor.shift();
      let editor = [
        ...motelUpdate.editor,
        { user: req.user.id, edited, createdAt: Date.now() },
      ];
      motelUpdate.editor = editor;
      await motelUpdate.save();
      res.status(200).json({ success: true, message: "Cập nhật thành công" });
    } catch {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  else {
    const newRoomAtr = new userUpdateRoom({
      type: "push",
      motel: id,
      room: undefined,
      user: req.user.id,
      optional: optionalFixed,
      area,
      price,
      total,
      remain,
      status,
    });
    try {
      await newRoomAtr.save();
      return res
        .status(200)
        .json({ success: true, message: "Thành công, vui lòng chờ duyệt" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  }
});
router.patch("/:id/:idRoom", verifyToken, async (req, res) => {
  const { optional, price, area, total, remain, status } = req.body;

  if (!req.params.id || !req.params.idRoom)
    return res.status(400).json({
      success: false,
      message: "Không nhận được thông tin cần thiết để xóa loại phòng",
    });
  const id = req.params.id;
  const idRoom = req.params.idRoom;
  const findMotel = await motel.findById(id);
  if (!findMotel)
    return res
      .status(400)
      .json({ success: false, message: "Không tồn tại nhà trọ" });

  const findRoom = findMotel.room.find(
    (item) => JSON.stringify(item._id) === JSON.stringify(idRoom)
  );
  if (!findRoom)
    return res
      .status(400)
      .json({ success: false, message: "Không tồn tại loại phòng này" });

  if (
    Array.isArray(optional) == false &&
    typeof price !== "number" &&
    typeof area !== "object" &&
    typeof total !== "number" &&
    typeof remain !== "number" &&
    typeof status !== "boolean"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Không tìm thấy dữ liệu mới" });
  }

  newData = {};

  if (optional) {
    var optionalFixed = {
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
    for (let i = 0; i < optional.length; i++) optionalFixed[optional[i]] = true;
    newData.optional = optionalFixed;
  }
  if (typeof price === "number") {
    newData.price = price;
  }
  if (area)
    if (typeof area.width === "number" && typeof area.length === "number") {
      newData.area = area;
    }
  if (typeof total === "number") newData.total = total;
  if (typeof remain === "number") {
    newData.remain = remain;
  }
  if (typeof status === "boolean") {
    newData.status = status;
  }
  let index = 1;
  for (let i = 0; i < findMotel.room.length; i++) {
    if (JSON.stringify(findMotel.room[i]._id) === JSON.stringify(idRoom)) break;
    index++;
  }
  let edited = "Chỉnh sửa phòng trọ (" + index + "): ";
  if (Array.isArray(optional)) {
    let check = [];
    for (const property in findRoom.optional)
      if (findRoom.optional[property] == true) check.push(property);

    for (let i = 0; i < optional.length; i++)
      if (
        !check.some((item) => {
          item === optional[i];
        })
      ) {
        edited += "tiện ích";
        break;
      }
  }
  if (typeof price === "number")
    if (price != findRoom.price)
      if (edited === "Chỉnh sửa phòng trọ (" + index + "): ") edited += "giá";
      else edited += ", giá";
  if (area)
    if (typeof area.width === "number" && typeof area.length === "number")
      if (
        area.width != findRoom.area.width ||
        area.length != findRoom.area.length
      )
        if (edited === "Chỉnh sửa phòng trọ (" + index + "): ")
          edited += "diện tích";
        else edited += ", diện tích";
  if (typeof status === "boolean")
    if (status != findRoom.status)
      if (edited === "Chỉnh sửa phòng trọ (" + index + "): ")
        edited += "phòng trống";
      else edited += ", phòng trống";
  if (typeof remain === "number")
    if (remain != findRoom.remain)
      if (edited === "Chỉnh sửa phòng trọ (" + index + "): ")
        edited += "phòng trống";
      else edited += ", phòng trống";

  if (findMotel.editor.length >= 3) findMotel.editor.shift();
  let editedData = [
    ...findMotel.editor,
    { user: req.user.id, edited, createdAt: Date.now() },
  ];
  if (req.user.isAdmin == true) {
    try {
      await motel.findOneAndUpdate(
        { _id: id, "room._id": idRoom },
        {
          $set: {
            "room.$.area": newData.area,
            "room.$.price": newData.price,
            "room.$.remain": newData.remain,
            "room.$.optional": newData.optional,
            "room.$.total": newData.total,
          },
        }
      );
      await motel.findOneAndUpdate({ _id: id }, { editor: editedData });
      return res.status(200).json({ success: true, message: "Thành công" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  } else {
    const newRoomAtr = new userUpdateRoom({
      type: "set",
      motel: id,
      room: idRoom,
      user: req.user.id,
      area: newData.area,
      price: newData.price,
      status: newData.status,
      remain: newData.remain,
      optional: newData.optional,
      total: newData.total,
    });
    try {
      await newRoomAtr.save();
      return res
        .status(200)
        .json({ success: true, message: "Thành công, vui lòng chờ duyệt" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  }
});
router.delete("/:id/:idRoom", verifyToken, async (req, res) => {
  if (!req.params.id || !req.params.idRoom)
    return res.status(400).json({
      success: false,
      message: "Không nhận được thông tin cần thiết để xóa loại phòng",
    });
  const id = req.params.id;
  const idRoom = req.params.idRoom;
  const findMotel = await motel.findById(id);
  if (!findMotel)
    return res
      .status(400)
      .json({ success: false, message: "Không tồn tại nhà trọ" });
  const findRoom = findMotel.room.find(
    (item) => JSON.stringify(item._id) === JSON.stringify(idRoom)
  );
  let index = 0;
  for (let i = 0; i < findMotel.room.length; i++) {
    if (JSON.stringify(findMotel.room[i]._id) === JSON.stringify(idRoom)) break;
    index++;
  }
  let edited = "Xóa phòng trọ " + index;
  if (findMotel.editor.length >= 3) findMotel.editor.shift();
  let editor = [
    ...findMotel.editor,
    { user: req.user.id, edited, createdAt: Date.now() },
  ];
  if (!findRoom)
    return res
      .status(400)
      .json({ success: false, message: "Không tồn tại loại phòng này" });
  if (req.user.isAdmin == true)
    try {
      await motel.findOneAndUpdate(
        { _id: id },
        { $pull: { room: { _id: idRoom } }, editor }
      );
      res.status(200).json({ success: true, message: "Cập nhật thành công" });
    } catch {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  else {
    const newRoomAtr = new userUpdateRoom({
      type: "pull",
      motel: id,
      room: idRoom,
      user: req.user.id,
      area: findRoom.area,
      price: findRoom.price,
      remain: findRoom.remain,
      optional: findRoom.optional,
      total: findRoom.total,
    });
    try {
      await newRoomAtr.save();
      return res
        .status(200)
        .json({ success: true, message: "Thành công, vui lòng chờ duyệt" });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  }
});

module.exports = router;
