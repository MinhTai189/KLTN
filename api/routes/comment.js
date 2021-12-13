const express = require("express");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const comment = require("../models/comment");
const post = require("../models/post");
const school = require("../models/school");
const user = require("../models/user");
const report = require("../models/report");
const router = express.Router();
const add = require("../utils/done");
const ObjectId = require("mongoose").Types.ObjectId;
const commentRouter = (io) => {
  router.post("/reports", verifyToken, async (req, res) => {
    try {
      const { commentId, content } = req.body;
      if (!commentId)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp thông tin bình luận",
        });
      if (!commentId)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cho biết tại sao bạn tố cáo bình luận này này",
        });
      const checkComment = await comment.findById(commentId);
      if (!checkComment)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bình luận" });
      const newReport = new report({
        id1: commentId,
        id2: "",
        content: content,
        owner: req.user.id,
        type: "comment",
      });
      await newReport.save();
      return res
        .status(200)
        .json({ success: true, message: "Tố cáo thành công" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  });
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
    const type = req.body.params.type;

    try {
      if (!findComment)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bình luận" });
      let isLiked = false;
      if (
        findComment.likes.some((item) => {
          return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
        })
      ) {
        isLiked = true;
        findComment.likes = findComment.likes.filter((item) => {
          return JSON.stringify(item.owner) !== JSON.stringify(req.user.id);
        });
      }

      findComment.likes = [
        ...findComment.likes,
        {
          type: parseInt(type),
          owner: req.user.id,
        },
      ];

      await findComment.save();
      res.status(200).json({ success: true, message: "Like thành công" });
      if (!isLiked)
        if (JSON.stringify(req.user.id) !== JSON.stringify(findComment.owner)) {
          const getNameUser = await user.findById(req.user.id).select("name");
          const icons = [
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/love_vil1yw.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/kiss_l4lskr.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/haha_rrtxk7.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/wow_wul2rc.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/cry_r0n92w.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060680/emoji/angry_iugdix.png",
          ];
          io.notifyToUser(findComment.owner, {
            message: `${getNameUser.name} vừa bày tỏ cảm xúc về bình luận của bạn`,
            url: `/posts/${findComment.post}`,
            imageUrl: icons[type],
          });
        }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi không xác định" });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const { _page, _limit } = req.query;
      const { id } = req.params;

      const getByRootComment = await comment
        .find({
          "reply.rootComment": new ObjectId(id),
        })
        .populate("reply.user owner");
      let responseComments = [];

      for (let j = 0; j < getByRootComment.length; j++) {
        const user = {
          avatarUrl: getByRootComment[j].reply.user.avatarUrl.url,
          name: getByRootComment[j].reply.user.name,
          isAdmin: getByRootComment[j].reply.user.isAdmin,
          _id: getByRootComment[j].reply.user.id,
          credit: getByRootComment[j].reply.user.credit,
          email: getByRootComment[j].reply.user.email,

          posts: getByRootComment[j].reply.user.posts,
          rank: getByRootComment[j].reply.user.rank,
        };
        const owner = {
          avatarUrl: getByRootComment[j].owner.avatarUrl.url,
          name: getByRootComment[j].owner.name,
          isAdmin: getByRootComment[j].owner.isAdmin,
          _id: getByRootComment[j].owner.id,
          credit: getByRootComment[j].owner.credit,
          email: getByRootComment[j].owner.email,
          posts: getByRootComment[j].owner.posts,
          rank: getByRootComment[j].owner.rank,
        };

        responseComments.push({
          ...getByRootComment[j]._doc,
          user: user,
          owner: owner,
          comment: getByRootComment[j].reply.comment,
          numLikes: [
            getByRootComment[j].likes.filter((like) => like.type === 0).length,
            getByRootComment[j].likes.filter((like) => like.type === 1).length,
            getByRootComment[j].likes.filter((like) => like.type === 2).length,
            getByRootComment[j].likes.filter((like) => like.type === 3).length,
            getByRootComment[j].likes.filter((like) => like.type === 4).length,
            getByRootComment[j].likes.filter((like) => like.type === 5).length,
          ],
          totalLikes: getByRootComment[j].likes.length,
        });
        delete responseComments[j].reply;
      }
      responseComments = responseComments.sort((cmt1, cmt2) => {
        return new Date(cmt1.createdAt) - new Date(cmt2.createdAt);
      });
      let limit = responseComments.length;
      let page = 1;
      let totalRows = responseComments.length;
      if (_limit) limit = parseInt(_limit);
      if (_page) page = parseInt(_page);
      responseComments = responseComments.slice(
        (page - 1) * limit,
        page * limit
      );
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
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  });
  router.post("/:idPost", verifyToken, async (req, res) => {
    try {
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
        return res.status(403).json({
          success: false,
          message: "Khổng thể thực hiện hành động này",
        });

      const { content, commentId, userId } = req.body;
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
      if (commentId) {
        const check = await comment.findOne({
          _id: commentId,
          post: findPost._id,
        });
        if (!check)
          return res.status(400).json({
            success: false,
            message:
              "Bình luận bạn đang trả lời không tồn tại hoặc không thuộc bài viết này",
          });

        if (check.reply)
          newComment.reply = {
            comment: commentId,
            user: userId,
            rootComment: check.reply.rootComment,
          };
        else
          newComment.reply = {
            comment: commentId,
            user: userId,
            rootComment: commentId,
          };
      }

      await newComment.save();
      if (JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner))
        io.notifyToUser(findPost.owner, {
          message: ` vừa bình luận bài viết của bạn`,
          url: `/posts/${findPost._id}`,
          ownerId: req.user.id,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1638661792/notify/comment_iaa4wh.png",
        });
      if (newComment.reply)
        add(req.user.id, "Trả lời bình luận", {
          type: "repComment",
          commentId: commentId,
          content: content,
          postId: postId,
        });
      else
        add(req.user.id, "Bình luận bài viết", {
          type: "createdComment",
          postId: postId,
          content: content,
        });
      if (newComment.reply)
        if (JSON.stringify(req.user.id) !== JSON.stringify(userId))
          io.notifyToUser(userId, {
            message: ` vừa trả lời bình luận của bạn`,
            url: `/posts/${findPost._id}`,
            ownerId: req.user.id,
            imageUrl:
              "https://res.cloudinary.com/dpregsdt9/image/upload/v1638661946/notify/discussion_vjlxsw.png",
          });
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
        .populate("post", "title _id subject")
        .populate("likes.owner", "name avatarUrl rank")
        .populate("reply.user");
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
        const owner = {
          avatarUrl: comments[i].owner.avatarUrl.url,
          name: comments[i].owner.name,
          isAdmin: comments[i].owner.isAdmin,
          _id: comments[i].owner.id,
          credit: comments[i].owner.credit,
          email: comments[i].owner.email,

          posts: comments[i].owner.posts,
          rank: comments[i].owner.rank,
        };

        responseComments.push({
          ...comments[i]._doc,
          owner: owner,
          likes: comments[i].likes.map((like) => {
            return {
              ...like._doc,
              owner: {
                ...like.owner._doc,
                avatarUrl: like.owner.avatarUrl.url,
              },
            };
          }),

          numLikes: [
            comments[i].likes.filter((like) => like.type === 0).length,
            comments[i].likes.filter((like) => like.type === 1).length,
            comments[i].likes.filter((like) => like.type === 2).length,
            comments[i].likes.filter((like) => like.type === 3).length,
            comments[i].likes.filter((like) => like.type === 4).length,
            comments[i].likes.filter((like) => like.type === 5).length,
          ],
          totalLikes: comments[i].likes.length,
        });
      }

      responseComments = responseComments.sort((cmt1, cmt2) => {
        return new Date(cmt1.createdAt) - new Date(cmt2.createdAt);
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
          if (item.post != null)
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
      let deleteComment = [];
      for (let i = 0; i < responseComments.length; i++) {
        if (!responseComments[i].reply) responseComments[i].reply = [];
        for (let j = 0; j < responseComments.length; j++) {
          if (responseComments[j].reply)
            if (!Array.isArray(responseComments[j].reply))
              if (
                JSON.stringify(responseComments[j].reply.rootComment) ===
                JSON.stringify(responseComments[i]._id)
              ) {
                responseComments[i].reply.push({ ...responseComments[j] });
                responseComments[i].reply[
                  responseComments[i].reply.length - 1
                ].comment = responseComments[j].reply.comment;
                delete responseComments[i].reply[
                  responseComments[i].reply.length - 1
                ].reply;

                delete responseComments[i].reply[
                  responseComments[i].reply.length - 1
                ].post;

                const user = {
                  avatarUrl: responseComments[j].reply.user.avatarUrl.url,
                  name: responseComments[j].reply.user.name,
                  isAdmin: responseComments[j].reply.user.isAdmin,
                  _id: responseComments[j].reply.user.id,
                  credit: responseComments[j].reply.user.credit,
                  email: responseComments[j].reply.user.email,

                  posts: responseComments[j].reply.user.posts,
                  rank: responseComments[j].reply.user.rank,
                };
                responseComments[i].reply[
                  responseComments[i].reply.length - 1
                ].user = user;
                deleteComment.push(responseComments[j]);
                // responseComments = responseComments.filter((item) => {
                //   return (
                //     JSON.stringify(item._id) !==
                //     JSON.stringify(responseComments[j]._id)
                //   );
                // });
              }
        }
      }
      for (let i = 0; i < deleteComment.length; i++) {
        responseComments = responseComments.filter((item) => {
          return (
            JSON.stringify(item._id) !== JSON.stringify(deleteComment[i]._id)
          );
        });
      }
      responseComments = responseComments.sort((cmt1, cmt2) => {
        return new Date(cmt2.createdAt) - new Date(cmt1.createdAt);
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
        }

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
      responseComments = responseComments.slice(
        (page - 1) * limit,
        limit * page
      );
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
          "reply.rootComment": deleteComment._id,
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
  return router;
};
module.exports = commentRouter;
