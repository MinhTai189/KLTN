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
const review = require("../models/review");
const comment = require("../models/comment");
const router = express.Router();

router.get("/details", async (req, res) => {
  const { _id1, _id2, _type } = req.query;
  let response;
  if (_type === "post") {
    const getPostInvalid = await post
      .findById(_id1)
      .populate("subject")
      .populate("owner", "-unsignedName -refreshToken")
      .select("-valid");
    if (!getPostInvalid)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thây bài viết" });
    if (getPostInvalid.valid == true)
      return res
        .status(400)
        .json({ success: false, message: "Bài viết này đã được duyệt rồi" });
    response = { ...getPostInvalid._doc };

    if (getPostInvalid.subject._id.toString() === "6173ba553c954151dcc8fdf9") {
      const getReviewInvalid = await review.findOne({
        post: getPostInvalid._id,
      });
      if (!getReviewInvalid)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy nội dung review" });
      const ownerSchool = await school
        .findOne({ codeName: response.owner.school })
        .select("-nameDistricts");
      let owner = {
        avatarUrl: response.owner.avatarUrl.url,
        name: response.owner.name,
        isAdmin: response.owner.isAdmin,
        _id: response.owner.id,
        credit: response.owner.credit,
        email: response.owner.email,
        school: ownerSchool,
        motels: response.owner.motels,
        rank: response.owner.rank,
      };
      response.review = getReviewInvalid;
      res.owner = owner;
    }
  } else if (_type === "report") {
    const getReport = await report
      .findById(_id1)
      .populate("owner", "-unsignedName -refreshToken");
    if (!getReport)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy report này" });
    if (getReport.type === "rate") {
      const getMotelRating = await motel.findById(getReport.id1);
      if (!getMotelRating)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy nhà trọ này hoặc nhà trọ đã bị xóa",
        });
      const getRate = getMotelRating.rate.find((item) => {
        return JSON.stringify(getReport.id2) === JSON.stringify(item._id);
      });
      if (!getRate)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy đánh giá này hoặc đánh giá đã bị xóa",
        });
      response = {
        rate: {
          ...getRate._doc,
          motel: getMotelRating._id,
        },
        content: getReport.content,
        owner: getReport.owner,
      };
      const ownerSchool = await school
        .findOne({ codeName: response.owner.school })
        .select("-nameDistricts");
      let owner = {
        avatarUrl: response.owner.avatarUrl.url,
        name: response.owner.name,
        isAdmin: response.owner.isAdmin,
        _id: response.owner.id,
        credit: response.owner.credit,
        email: response.owner.email,
        school: ownerSchool,
        motels: response.owner.motels,
        rank: response.owner.rank,
      };
      response.owner = owner;
    } else if (getReport.type === "post") {
      const getPost = await post.findById(getReport.id1);
      if (!getPost)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài viết này hoặc bài viết đã bị xóa",
        });
      response = {
        post: {
          ...getPost._doc,
        },
        content: getReport.content,
        owner: getReport.owner,
      };
      const ownerSchool = await school
        .findOne({ codeName: response.owner.school })
        .select("-nameDistricts");
      let owner = {
        avatarUrl: response.owner.avatarUrl.url,
        name: response.owner.name,
        isAdmin: response.owner.isAdmin,
        _id: response.owner.id,
        credit: response.owner.credit,
        email: response.owner.email,
        school: ownerSchool,
        motels: response.owner.motels,
        rank: response.owner.rank,
      };
      response.owner = owner;
    } else if (getReport.type === "comment") {
      const getComment = await comment.findById(getReport.id1);
      if (!getComment)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài viết này hoặc bài viết đã bị xóa",
        });
      response = {
        comment: {
          ...getComment._doc,
        },
        content: getReport.content,
        owner: getReport.owner,
      };
      const ownerSchool = await school
        .findOne({ codeName: response.owner.school })
        .select("-nameDistricts");
      let owner = {
        avatarUrl: response.owner.avatarUrl.url,
        name: response.owner.name,
        isAdmin: response.owner.isAdmin,
        _id: response.owner.id,
        credit: response.owner.credit,
        email: response.owner.email,
        school: ownerSchool,
        motels: response.owner.motels,
        rank: response.owner.rank,
      };
      response.owner = owner;
    }
  } else if (_type === "rate") {
    const getMotelRating = await motel
      .findById(_id1)
      .populate("rate.user", "-unsignedName -refreshToken");
    if (!getMotelRating)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy nhà trọ này hoặc nhà trọ đã bị xóa",
      });
    const getRate = getMotelRating.rate.find((item) => {
      return JSON.stringify(_id2) === JSON.stringify(item._id);
    });
    if (!getRate)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy đánh giá này hoặc đánh giá đã bị xóa",
      });

    let resRate = { ...getRate._doc, motel: getMotelRating._id };
    const ownerSchool = await school
      .findOne({ codeName: resRate.user.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: resRate.user.avatarUrl.url,
      name: resRate.user.name,
      isAdmin: resRate.user.isAdmin,
      _id: resRate.user._id,
      credit: resRate.user.credit,
      email: resRate.user.email,
      school: ownerSchool,
      motels: resRate.user.motels,
      rank: resRate.user.rank,
    };
    delete resRate.user;
    resRate.owner = owner;
    response = resRate;
  } else if (_type === "room") {
    const getNewUpdateRoom = await userUpdateRoom
      .findById(_id1)
      .populate("motel")
      .populate("user", "-refreshToken -password");
    if (!getNewUpdateRoom)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy thông tin cập nhật nhật này",
      });
    const getMotel = getNewUpdateRoom.motel;

    const getRoom = getMotel.room.find((item) => {
      return JSON.stringify(getNewUpdateRoom.room) === JSON.stringify(item._id);
    });
    if (!getRoom)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy phòng này hoặc đã bị xóa",
      });
    console.log(getNewUpdateRoom);
    const ownerSchool = await school
      .findOne({ codeName: getNewUpdateRoom.user.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: getNewUpdateRoom.user.avatarUrl.url,
      name: getNewUpdateRoom.user.name,
      isAdmin: getNewUpdateRoom.user.isAdmin,
      _id: getNewUpdateRoom.user._id,
      credit: getNewUpdateRoom.user.credit,
      email: getNewUpdateRoom.user.email,
      school: ownerSchool,
      motels: getNewUpdateRoom.user.motels,
      rank: getNewUpdateRoom.user.rank,
    };
    let newRoom = {
      ...getNewUpdateRoom._doc,
    };
    delete newRoom.type;
    delete newRoom.motel;
    delete newRoom.user;
    delete newRoom.room;
    response = {
      oldRoom: {
        ...getRoom._doc,
      },
      newRoom,
      owner,
    };
  } else if (_type === "motel") {
    const motelNewUpdate = await userUpdateMotel
      .findById(_id1)
      .populate("user")
      .select("-unsignedName -room")
      .populate("school", "-nameDistricts");
    if (!motelNewUpdate)
      return res.status(400).json({
        success: false,
        message: "Không tìm được thông tin cập nhật này",
      });
    const findMotel = await motel
      .findById(motelNewUpdate.motel)
      .populate("owner")
      .select("-unsignedName -room")
      .populate("school", "-nameDistricts");
    if (!findMotel)
      return res.status(400).json({
        success: false,
        message: "Nhà trọ này không tồn tại hoặc đã bị xóa",
      });
    const ownerNewSchool = await school
      .findOne({ codeName: motelNewUpdate.user.school })
      .select("-nameDistricts");
    let ownerNew = {
      avatarUrl: motelNewUpdate.user.avatarUrl.url,
      name: motelNewUpdate.user.name,
      isAdmin: motelNewUpdate.user.isAdmin,
      _id: motelNewUpdate.user._id,
      credit: motelNewUpdate.user.credit,
      email: motelNewUpdate.user.email,
      school: ownerNewSchool,
      motels: motelNewUpdate.user.motels,
      rank: motelNewUpdate.user.rank,
    };
    const ownerOldSchool = await school
      .findOne({ codeName: findMotel.owner.school })
      .select("-nameDistricts");
    let ownerOld = {
      avatarUrl: findMotel.owner.avatarUrl.url,
      name: findMotel.owner.name,
      isAdmin: findMotel.owner.isAdmin,
      _id: findMotel.owner._id,
      credit: findMotel.owner.credit,
      email: findMotel.owner.email,
      school: ownerOldSchool,
      motels: findMotel.owner.motels,
    };
    let newMotel = {
      ...motelNewUpdate._doc,
      owner: ownerNew,
      thumbnail: motelNewUpdate.thumbnail.url,
      images: motelNewUpdate.images.map((item) => {
        if (typeof item === "string") return item;
        else return item.url;
      }),
    };
    delete newMotel.user;

    response = {
      newMotel,
      oldMotel: {
        ...findMotel._doc,
        owner: ownerOld,
        thumbnail: findMotel.thumbnail.url,
        images: findMotel.images.map((item) => {
          return item.url;
        }),
      },
    };
  } else if (_type === "new-motel") {
    const newMotel = await unapprovedMotel
      .findById(_id1)
      .populate("owner")
      .select("-unsignedName")
      .populate("school", "-nameDistricts");
    const ownerSchool = await school
      .findOne({ codeName: newMotel.owner.school })
      .select("-nameDistricts");
    let owner = {
      avatarUrl: newMotel.owner.avatarUrl.url,
      name: newMotel.owner.name,
      isAdmin: newMotel.owner.isAdmin,
      _id: newMotel.owner._id,
      credit: newMotel.owner.credit,
      email: newMotel.owner.email,
      school: ownerSchool,
      motels: newMotel.owner.motels,
      rank: newMotel.owner.rank,
    };
    response = {
      ...newMotel._doc,
      owner: owner,
      thumbnail: newMotel.thumbnail.url,
      images: newMotel.images.map((item) => {
        return item.url;
      }),
    };
  } else if (_type === "feedback") {
    const getFeedBack = await feedBack.findById(_id1).populate("owner");
    const ownerSchool = await school
      .findOne({ codeName: getFeedBack.owner.school })
      .select("-nameDistricts");
    const owner = {
      avatarUrl: getFeedBack.owner.avatarUrl.url,
      name: getFeedBack.owner.name,
      isAdmin: getFeedBack.owner.isAdmin,
      _id: getFeedBack.owner._id,
      credit: getFeedBack.owner.credit,
      email: getFeedBack.owner.email,
      school: ownerSchool,
      motels: getFeedBack.owner.motels,

      rank: getFeedBack.owner.rank,
    };
    response = { ...getFeedBack._doc, owner: owner };
  }
  return res.status(200).json({ success: true, data: response });
});
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
      rank: rates[i].user.rank,
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
      rank: newMotel[i].owner.rank,
    };

    responseApprove.push({
      title: "Nhà trọ mới: " + newMotel[i].name,
      id1: newMotel[i]._id,
      id2: "",
      createdAt: newMotel[i].createdAt,
      type: "new-motel",
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
      rank: updateMotel[i].user.rank,
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
      rank: updateRoom[i].user.rank,
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
      rank: newPost[i].owner.rank,
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
      rank: newFeedBack[i].owner.rank,
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
      rank: reports[i].owner.rank,
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
