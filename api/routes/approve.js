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
const removeVietnameseTones = require("../middleware/removeVietnameseTones");
const router = express.Router();

router.get("/", async (req, res) => {
  // if (req.user.isAdmin == false)
  //   res.status(400).json({
  //     message: "Bạn không đủ quyền hạn",
  //   });

  const newMotel = await unapprovedMotel.find({}).populate("owner");
  const updateMotel = await userUpdateMotel.find({}).populate("user");
  const updateRoom = await userUpdateRoom
    .find({})
    .populate("user")
    .populate("motel");
  const newPost = await post.find({ valid: false }).populate("owner");
  const newFeedBack = await feedBack.find({}).populate("owner");
  const allMotel = await motel.find({}).populate("rate.user");
  const reports = await report.find({}).populate("owner");
  let rates = [];
  let responseApprove = [];
  for (let i = 0; i < allMotel.length; i++)
    for (let j = 0; j < allMotel[i].rate.length; j++)
      if (allMotel[i].rate[j].valid == false)
        rates.push({
          ...allMotel[i].rate[j]._doc,
          motel: { id: allMotel[i]._id, name: allMotel[i].name },
        });
  for (let i = 0; i < rates.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: rates[i].user.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: rates[i].user.avatarUrl.url,
      name: rates[i].user.name,
      isAdmin: rates[i].user.isAdmin,
      _id: rates[i].user.id,
      credit: rates[i].user.credit,
      email: rates[i].user.email,
      school: ownerSchool,
      motels: rates[i].user.motels,
    };
    responseApprove.push({
      title: "Đánh giá " + rates[i].motel.name,
      id1: rates[i].motel.id,
      id2: rates[i]._id,
      createdAt: rates[i].createAt,
      type: "rate",
      owner: owner,
    });
  }
  for (let i = 0; i < newMotel.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: newMotel[i].owner.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: newMotel[i].owner.avatarUrl.url,
      name: newMotel[i].owner.name,
      isAdmin: newMotel[i].owner.isAdmin,
      _id: newMotel[i].owner.id,
      credit: newMotel[i].owner.credit,
      email: newMotel[i].owner.email,
      school: ownerSchool,
      motels: newMotel[i].owner.motels,
    };
    responseApprove.push({
      title: "Nhà trọ mới: " + newMotel[i].name,
      id1: newMotel[i]._id,
      id2: "",
      createdAt: newMotel[i].createdAt,
      type: "newMotel",
      owner,
    });
  }
  for (let i = 0; i < updateMotel.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: updateMotel[i].user.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: updateMotel[i].user.avatarUrl.url,
      name: updateMotel[i].user.name,
      isAdmin: updateMotel[i].user.isAdmin,
      _id: updateMotel[i].user.id,
      credit: updateMotel[i].user.credit,
      email: updateMotel[i].user.email,
      school: ownerSchool,
      motels: updateMotel[i].user.motels,
    };
    responseApprove.push({
      title: "Sửa thông tin " + updateMotel[i].name,
      id1: updateMotel[i]._id,
      id2: "",
      createdAt: updateMotel[i].createdAt,
      type: "motel",
      owner,
    });
  }
  for (let i = 0; i < updateRoom.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: updateRoom[i].user.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: updateRoom[i].user.avatarUrl.url,
      name: updateRoom[i].user.name,
      isAdmin: updateRoom[i].user.isAdmin,
      _id: updateRoom[i].user.id,
      credit: updateRoom[i].user.credit,
      email: updateRoom[i].user.email,
      school: ownerSchool,
      motels: updateRoom[i].user.motels,
    };
    let type = "room";

    responseApprove.push({
      title: "Sửa phòng của " + updateRoom[i].motel.name,
      id1: updateRoom[i]._id,
      id2: "",
      createdAt: updateRoom[i].createdAt,
      type: type,
      owner,
    });
  }
  for (let i = 0; i < newPost.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: newPost[i].owner.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: newPost[i].owner.avatarUrl.url,
      name: newPost[i].owner.name,
      isAdmin: newPost[i].owner.isAdmin,
      _id: newPost[i].owner.id,
      credit: newPost[i].owner.credit,
      email: newPost[i].owner.email,
      school: ownerSchool,
      motels: newPost[i].owner.motels,
    };
    responseApprove.push({
      title: "Bài viết mới: " + newPost[i].title,
      id1: newPost[i]._id,
      id2: "",
      createdAt: newPost[i].createdAt,
      type: "post",
      owner,
    });
  }
  for (let i = 0; i < newFeedBack.length; i++) {
    const ownerSchool = await school
      .findOne({ codeName: newFeedBack[i].owner.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: newFeedBack[i].owner.avatarUrl.url,
      name: newFeedBack[i].owner.name,
      isAdmin: newFeedBack[i].owner.isAdmin,
      _id: newFeedBack[i].owner.id,
      credit: newFeedBack[i].owner.credit,
      email: newFeedBack[i].owner.email,
      school: ownerSchool,
      motels: newFeedBack[i].owner.motels,
    };
    responseApprove.push({
      title: "Góp ý của " + owner.name,
      id1: newFeedBack[i]._id,
      id2: "",
      createdAt: newFeedBack[i].createdAt,
      type: "feedback",
      owner,
    });
  }
  for (let i = 0; i < reports.length; i++) {
    let type = "";
    if (reports[i].type === "rate") type = "Tố cáo đánh giá";
    else if (reports[i].type === "post") type = "Tố cáo bài viết";
    else if (reports[i].type === "comment") type = "Tố cáo bình luận";

    const ownerSchool = await school
      .findOne({ codeName: reports[i].owner.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: reports[i].owner.avatarUrl.url,
      name: reports[i].owner.name,
      isAdmin: reports[i].owner.isAdmin,
      _id: reports[i].owner.id,
      credit: reports[i].owner.credit,
      email: reports[i].owner.email,
      school: ownerSchool,
      motels: reports[i].owner.motels,
    };
    responseApprove.push({
      title: type,
      id1: reports[i]._id,
      id2: "",
      createdAt: reports[i].createdAt,
      type: "report",
      owner,
    });
  }
  responseApprove = responseApprove.sort((a1, a2) => {
    return new Date(a2.createdAt) - new Date(a1.createdAt);
  });
  const { _order, _sort, _limit, _page, _role, _user, _type, _namelike } =
    req.query;
  if (typeof _namelike === "string")
    responseApprove = responseApprove.filter((item) => {
      const test = new RegExp(
        removeVietnameseTones(_namelike).toLowerCase(),
        "i"
      );
      return test.test(removeVietnameseTones(item.owner.name.toLowerCase()));
    });
  if (typeof _role === "string")
    if (_role.toLowerCase() === "admin")
      responseApprove = responseApprove.filter(
        (item) => item.owner.isAdmin == true
      );
    else if (_role.toLowerCase() === "user")
      responseApprove = responseApprove.filter(
        (item) => item.owner.isAdmin == false
      );
  if (typeof _user === "string")
    responseApprove = responseApprove.filter((item) => item.owner._id == _user);
  if (typeof _type === "string")
    responseApprove = responseApprove.filter((item) => item.type == _type);
  if (_order && _sort)
    if (_sort === "createdat") {
      if ((_order = "asc"))
        responseApprove = responseApprove.sort((post1, post2) => {
          return new Date(post1.createdAt) - new Date(post2.createdAt);
        });
      else if ((_order = "desc"))
        responseApprove = responseApprove.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        });
    }
  let limit = responseApprove.length;
  let page = 1;
  let totalRows = responseApprove.length;
  if (_limit && _page != undefined)
    if (
      typeof parseInt(_limit) === "number" &&
      typeof parseInt(_page) === "number"
    ) {
      limit = parseInt(_limit);
      page = parseInt(_page);
      responseApprove = responseApprove.slice((page - 1) * limit, limit * page);
    }
  return res.status(200).json({
    message: "Thành công",
    success: true,
    data: responseApprove,
    pagination: {
      _page: page,
      _limit: limit,
      _totalRows: totalRows,
    },
  });
});
module.exports = router;
