const express = require("express");
const removeVietnameseTones = require("../middleware/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const comment = require("../models/comment");
const post = require("../models/post");
const school = require("../models/school");
const user = require("../models/user");
const router = express.Router();
router.delete("/likes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const findComment = await comment.findById(id);
  try {
    if (!findComment)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy comment" });
    const liked = findComment.likes.find((item) => {
      return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
    });
    console.log(findComment._id);
    if (!liked)
      return res
        .status(400)
        .json({ success: false, message: "Bạn chưa like comment này" });
    await comment.findOneAndUpdate(
      { _id: findComment._id },
      { $pull: { likes: { _id: liked._id } } }
    );

    return res
      .status(200)
      .json({ success: true, message: "unlike thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi không xác định" });
  }
});
router.post("/likes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const findComment = await comment.findById(id);
  const type = req.body.type;
  try {
    if (!findComment)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    if (
      findComment.likes.some((item) => {
        return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
      })
    )
      return res
        .status(400)
        .json({ success: false, message: "Đã like bình luận rồi" });
    findComment.likes.push({
      type: type,
      owner: req.user.id,
    });
    await findComment.save();
    return res.status(200).json({ success: true, message: "Like thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi không xác định" });
  }
});
router.post("/:idPost", verifyToken, async (req, res) => {
  try {
    console.log(req.body);
    const postId = req.params.idPost;
    const findPost = await post.findById(postId);

    if (!findPost)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bài viết này" });
    if (findPost.block == true)
      return res
        .status(403)
        .json({ success: false, message: "Bài viết này đã khóa" });
    if (findPost.valid == false)
      return res
        .status(403)
        .json({ success: false, message: "Khổng thể thực hiện hành động này" });

    const { content, reply } = req.body;
    if (typeof content !== "string")
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp nội dung bình luận",
      });
    const newComment = new comment({
      content,
      owner: req.user.id,
      post: postId,
    });
    if (reply) {
      if (!reply.comment)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cho biết Comment bạn muốn trả lời",
        });
      const check = await comment.exists({
        _id: reply.comment,
        post: findPost._id,
      });
      if (!check)
        return res.status(400).json({
          success: false,
          message:
            "Comment bạn đang trả lời không tồm tại hoặc không thuộc bài viết này",
        });
      if (!reply.user)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cho biết người bạn muốn trả lời",
        });
      newComment.reply = reply;
    }

    await newComment.save();
    return res
      .status(200)
      .json({ success: true, message: "Đã gửi bình luận thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});
router.get("/", async (req, res) => {
  try {
    const comments = await comment
      .find({})
      .populate("owner")
      .populate("reply.user", "_id name")
      .populate("post", "title _id subject")
      .populate("likes.owner", "name avatarUrl rank");
    const {
      _role,
      _keysearch,
      _id,
      _user,
      _post,
      _sort,
      _order,
      _page,
      _limit,
      _subject,
    } = req.query;
    let responseComments = [];
    for (let i = 0; i < comments.length; i++) {
      const ownerSchool = await school
        .findOne({ codeName: comments[i].owner.school })
        .select("-nameDistricts");
      const owner = {
        avatarUrl: comments[i].owner.avatarUrl.url,
        name: comments[i].owner.name,
        isAdmin: comments[i].owner.isAdmin,
        _id: comments[i].owner.id,
        credit: comments[i].owner.credit,
        email: comments[i].owner.email,
        school: ownerSchool,
        posts: comments[i].owner.posts,
        rank: comments[i].owner.rank,
      };
      responseComments.push({
        ...comments[i]._doc,
        owner: owner,
        likes: comments[i].likes.map((like) => {
          return {
            ...like._doc,
            owner: { ...like.owner._doc, avatarUrl: like.owner.avatarUrl.url },
          };
        }),

        numLikes: [
          comments[i].likes.filter((like) => like.type === 1).length,
          comments[i].likes.filter((like) => like.type === 2).length,
          comments[i].likes.filter((like) => like.type === 3).length,
          comments[i].likes.filter((like) => like.type === 4).length,
          comments[i].likes.filter((like) => like.type === 5).length,
          comments[i].likes.filter((like) => like.type === 6).length,
        ],
        totalLikes: comments[i].likes.length,
      });
    }
    responseComments = responseComments.sort((cmt1, cmt2) => {
      return new Date(cmt2.createdAt) - new Date(cmt1.createdAt);
    });
    if (typeof _keysearch === "string")
      responseComments = responseComments.filter((item) => {
        const reg = new RegExp(removeVietnameseTones(_keysearch), "i");
        return (
          reg.test(removeVietnameseTones(item.content)) ||
          reg.test(removeVietnameseTones(item.owner.name)) ||
          reg.test(removeVietnameseTones(item.post.title))
        );
      });
    if (_role)
      responseComments = responseComments.filter((item) => {
        let role = false;
        if (_role.toLowerCase() === "admin") role = true;
        return item.owner.isAdmin == role;
      });
    if (_id)
      responseComments = responseComments.filter((item) => {
        return JSON.stringify(item._id) === JSON.stringify(_id);
      });
    if (_user)
      responseComments = responseComments.filter((item) => {
        return JSON.stringify(item.owner._id) === JSON.stringify(_user);
      });
    if (_post)
      responseComments = responseComments.filter((item) => {
        return JSON.stringify(item.post._id) === JSON.stringify(_post);
      });
    if (_order && _sort)
      if (_sort === "createdat") {
        if ((_order = "asc"))
          responseComments = responseComments.sort((cmt1, cmt2) => {
            return new Date(cmt1.createdAt) - new Date(cmt2.createdAt);
          });
        else if ((_order = "desc"))
          responseComments = responseComments.sort((cmt1, cmt2) => {
            return new Date(cmt2.createdAt) - new Date(cmt1.createdAt);
          });
      } else if (_sort === "likes") {
        if ((_order = "asc"))
          responseComments = responseComments.sort((cmt1, cmt2) => {
            return cmt1.likes.length - cmt2.likes.length;
          });
        else if ((_order = "desc"))
          responseComments = responseComments.sort((cmt1, cmt2) => {
            return cmt2.likes.length - cmt1.likes.length;
          });
      }
    if (_subject)
      responseComments = responseComments.filter((item) => {
        return JSON.stringify(item.post.subject) === JSON.stringify(_subject);
      });

    let page = 1;
    let limit = responseComments.length;
    let totalRows = responseComments.length;
    if (_page && _limit)
      if (
        typeof parseInt(_page) === "number" &&
        typeof parseInt(_limit) === "number"
      ) {
        limit = parseInt(_limit);
        page = parseInt(_page);
      }
    responseComments = responseComments.slice((page - 1) * limit, limit * page);
    res.status(200).json({
      success: true,
      data: responseComments,
      pagination: {
        _page: page,
        _limit: limit,
        _totalRows: totalRows,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi không xác định!" });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  const commentId = req.params.id;
  const deleteComment = await comment.findById(commentId);
  if (!deleteComment)
    return res
      .status(400)
      .json({ success: false, message: "Không tìm thấy bình luận này" });
  if (
    JSON.stringify(req.user.id) === JSON.stringify(deleteComment.owner) ||
    req.user.isAdmin
  ) {
    try {
      await comment.findByIdAndDelete(commentId);
      await comment.deleteMany({
        post: deleteComment.post,
        "reply.comment": deleteComment._id,
      });
      return res
        .status(200)
        .json({ success: true, message: "Đã xóa thành công bình luận" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  }
});
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const commentId = req.params.id;
    const findComment = await comment.findById(commentId);
    if (!findComment)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bình luận này" });
    const { content } = req.body;
    if (typeof content === "string") findComment.content = content;
    if (
      JSON.stringify(req.user.id) !== JSON.stringify(findComment.owner) &&
      req.user.isAdmin == false
    )
      res.status(403).json({ success: false, message: "Bạn không có quyền" });
    await findComment.save();
    return res
      .status(200)
      .json({ success: true, message: "Đã chỉnh sửa bình luận thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});
module.exports = router;
