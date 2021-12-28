const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const motel = require("../models/motel");
const report = require("../models/report");
const school = require("../models/school");
const user = require("../models/user");
const add = require("../utils/done");
const removeVietNameseTones = require("../utils/removeVietnameseTones");
const router = express.Router();
const rateRouter = (io) => {
  router.post("/reports", verifyToken, async (req, res) => {
    const { motelId, rateId, content } = req.body.params;
    if (typeof motelId !== "string")
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin nhà trọ" });
    if (typeof rateId !== "string")
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đánh giá" });
    if (typeof content !== "string")
      return res.status(400).json({
        success: false,
        message: "Vui lòng viết đầy đủ nội dung tố cáo",
      });
    const findMotel = await motel.findById(motelId);
    if (findMotel) {
      const rate = findMotel.rate.find(
        (item) => JSON.stringify(rateId) === JSON.stringify(item._id)
      );
      if (!rate)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy đánh giá" });
      const newReport = new report({
        id1: motelId,
        id2: rateId,
        content: content,
        owner: req.user.id,
        type: "rate",
      });
      try {
        await newReport.save();

        io.sendDashboardStatisticals("approvals");
        return res.status(200).json({
          success: true,
          message: "Đã báo cáo thành công đánh giá này",
        });
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Lỗi không xác định!" });
      }
    } else
      return res
        .status(400)
        .json({ success: false, message: "Không tìm được nhà trọ" });
  });
  router.delete("/violates/:id/:idRate", verifyToken, async (req, res) => {
    const id = req.params.id;
    const idRate = req.params.idRate;
    const findMotel = await motel.findById(id);
    if (findMotel) {
      const rate = findMotel.rate.find(
        (item) => JSON.stringify(idRate) === JSON.stringify(item._id)
      );
      if (!rate)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy đánh giá" });
      if (req.user.isAdmin == true)
        try {
          await motel.findOneAndUpdate(
            { _id: id },
            {
              $pull: { rate: { _id: idRate } },
              vote: findMotel.vote - rate.star,
              mark: (findMotel.vote - rate.star) / (findMotel.rate.length - 1),
            }
          );
          await user.findByIdAndUpdate(rate.user, { $inc: { credit: -20 } });
          return res
            .status(200)
            .json({ success: true, message: "Đã xóa thành công" });
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Lỗi không xác định" });
        }
      else
        return res
          .status(405)
          .json({ success: false, message: "Bạn không có quyền" });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà trọ" });
  });
  router.get("/", async (req, res) => {
    try {
      const { _order, _sort, _keysearch, _limit, _page, _role, _user, _motel } =
        req.query;
      const motelRates = await motel
        .find({})
        .select("rate name _id")
        .populate("rate.user");

      let rates = [];
      for (let i = 0; i < motelRates.length; i++)
        for (let j = 0; j < motelRates[i].rate.length; j++) {
          const mt = { _id: motelRates[i]._id, name: motelRates[i].name };

          const user = {
            avatarUrl: motelRates[i].rate[j].user.avatarUrl.url,
            name: motelRates[i].rate[j].user.name,
            isAdmin: motelRates[i].rate[j].user.isAdmin,
            _id: motelRates[i].rate[j].user.id,
            credit: motelRates[i].rate[j].user.credit,
            email: motelRates[i].rate[j].user.email,
            school: motelRates[i].rate[j].user.school,
            motels: motelRates[i].rate[j].user.motels,
            posts: motelRates[i].rate[j].user.posts,
            rank: motelRates[i].rate[j].user.rank,
            totalLikes: motelRates[i].rate[j].user.likes.length,
          };
          if (motelRates[i].rate[j].valid)
            rates.push({
              ...motelRates[i].rate[j]._doc,
              user: user,
              motel: mt,
            });
        }

      rates = rates.sort((rate1, rate2) => {
        return new Date(rate2.createAt) - new Date(rate1.createAt);
      });
      if (_motel)
        rates = rates.filter((rate) => {
          return JSON.stringify(rate.motel._id) === JSON.stringify(_motel);
        });
      if (_keysearch) {
        rates = rates.filter((item) => {
          return (
            removeVietNameseTones(item.user.unsignedName)
              .toLowerCase()
              .includes(removeVietNameseTones(_keysearch.toLowerCase())) ||
            removeVietNameseTones(item.motel.name)
              .toLowerCase()
              .includes(removeVietNameseTones(_keysearch.toLowerCase()))
          );
        });
      }
      if (_user)
        rates = rates.filter((item) => {
          JSON.stringify(item.user._id) === JSON.stringify(_user);
        });
      if (_sort && _order) {
        if (_sort === "createAt") {
          if (_order === "asc")
            rates = rates.sort((rate1, rate2) => {
              return new Date(rate1.createAt) - new Date(rate2.createAt);
            });
        } else if (_sort === "star") {
          if (_order === "asc")
            rates = rates.sort((rate1, rate2) => {
              return parseInt(rate1.star) - parseInt(rate2.star);
            });
          else if (_order === "desc")
            rates = rates.sort((rate1, rate2) => {
              return parseInt(rate2.star) - parseInt(rate1.star);
            });
        }
      }
      if (_role) {
        let role = false;
        if (_role.toLowerCase() === "admin") role = true;
        rates = rates.filter((item) => {
          return item.user.isAdmin === role;
        });
      }
      let limit = rates.length;
      let page = 1;
      let totalRows = rates.length;

      if (_page && _limit)
        if (
          typeof parseInt(_page) === "number" &&
          typeof parseInt(_limit) === "number"
        ) {
          limit = parseInt(_limit);
          page = parseInt(_page);
        }
      rates = rates.slice((page - 1) * limit, limit * page);
      res.status(200).json({
        success: true,
        message: "Thành công",
        data: rates,
        pagination: {
          _page: page,
          _limit: limit,
          _totalRows: totalRows,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  });

  router.post("/:id", verifyToken, async (req, res) => {
    let { content, star } = req.body.params;
    if (!star)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy số điểm đánh giá!" });
    if (typeof parseFloat(star) !== "number")
      return res
        .status(400)
        .json({ success: false, message: "Điểm đánh giá không hợp lệ!" });
    if (typeof parseFloat(star) > 5)
      return res.status(400).json({
        success: false,
        message: "Điểm đánh giá không được lớn hơn 5!",
      });
    const findMotel = await motel.findById(req.params.id);
    if (!findMotel)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà trọ" });
    else {
      try {
        const valid = req.user.isAdmin;
        if (valid) {
          await motel.findByIdAndUpdate(req.params.id, {
            $push: {
              rate: {
                content,
                star,
                createAt: undefined,
                user: req.user.id,
                valid: valid,
              },
            },
            vote: findMotel.vote + star,
            mark:
              (findMotel.vote + star) /
              (findMotel.rate.filter((item) => item.valid == true).length + 1),
          });

          add(
            req.user.id,
            "Đánh giá nhà trọ",
            {
              type: "rating",
              motelId: req.params.id,
              content: content,
              star: star,
            },
            io
          );
        } else
          await motel.findByIdAndUpdate(req.params.id, {
            $push: {
              rate: {
                content,
                star,
                createAt: undefined,
                user: req.user.id,
                valid: valid,
              },
            },
          });
        if (!req.user.isAdmin) {
          io.sendDashboardStatisticals("approvals");
          return res.status(200).json({
            success: true,
            message:
              "Đánh giá thành công, hãy chờ người quản trị duyệt thông tin này, xin cảm ơn bạn đã góp ý",
          });
        }
        if (req.user.isAdmin)
          if (JSON.stringify(req.user.id) !== JSON.stringify(findMotel.owner))
            io.notifyToUser(findMotel.owner, {
              message: ` vừa đánh giá về nhà trọ bạn đăng`,
              url: `/motels/${findMotel._id}`,
              ownerId: req.user.id,
              imageUrl:
                "https://res.cloudinary.com/dpregsdt9/image/upload/v1638662093/notify/rating_x9e2j5.png",
            });
        res.status(200).json({
          success: true,
          message: "Đánh giá thành công, xin cảm ơn bạn đã góp ý",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Lỗi",
        });
      }
    }
  });
  router.delete("/:id/:idRate", verifyToken, async (req, res) => {
    const id = req.params.id;
    const idRate = req.params.idRate;
    const findMotel = await motel.findById(id);
    if (findMotel) {
      const rate = findMotel.rate.find(
        (item) => JSON.stringify(idRate) === JSON.stringify(item._id)
      );
      if (!rate)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy đánh giá" });
      if (
        JSON.stringify(req.user.id) === JSON.stringify(rate.user) ||
        req.user.isAdmin == true
      )
        try {
          if (rate.valid)
            await motel.findOneAndUpdate(
              { _id: id },
              {
                $pull: { rate: { _id: idRate } },
                vote: findMotel.vote - rate.star,
                mark:
                  (findMotel.vote - rate.star) /
                  (findMotel.rate.filter((item) => item.valid == true).length -
                    1),
              }
            );
          else
            await motel.findOneAndUpdate(
              { _id: id },
              {
                $pull: { rate: { _id: idRate } },
              }
            );

          return res
            .status(200)
            .json({ success: true, message: "Đã xóa thành công" });
        } catch (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Lỗi không xác định" });
        }
      else
        return res
          .status(405)
          .json({ success: false, message: "Bạn không có quyền" });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà trọ" });
  });
  router.patch("/:id/:idRate", verifyToken, async (req, res) => {
    const id = req.params.id;
    const idRate = req.params.idRate;
    const findMotel = await motel.findById(id);
    const rate = findMotel.rate.find(
      (item) => JSON.stringify(idRate) === JSON.stringify(item._id)
    );
    if (!rate)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy đánh giá" });
    if (
      JSON.stringify(req.user.id) !== JSON.stringify(rate.user) ||
      req.user.isAdmin == false
    )
      return res
        .status(405)
        .json({ success: false, message: "Bạn không có quyền chỉnh sửa" });
    const { content, star } = req.body;
    await motel.findOneAndUpdate(
      { _id: id, "rate._id": idRate },
      {
        $set: { "rate.$.content": content, "rate.$.star": star },
        vote: findMotel.vote - rate.star + star,
        mark: (findMotel.vote - rate.star + star) / findMotel.rate.length,
      }
    );
    if (!findMotel)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy nhà trọ" });
    else return res.status(200).json({ success: true, message: "Thành công" });
  });
  return router;
};
module.exports = rateRouter;
