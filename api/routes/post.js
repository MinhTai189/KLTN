const express = require("express");
const router = express.Router();
const removeVietNameseTones = require("../utils/removeVietnameseTones");
const subjectModel = require("../models/subject");
const userModel = require("../models/user");
const commentModel = require("../models/comment");
const schoolModel = require("../models/school");
const post = require("../models/post");
const objectId = require("mongoose").Types.ObjectId;
const verifyToken = require("../middleware/verifyToken");
const report = require("../models/report");
const addDone = require("../utils/done");
const proposal = require("../utils/proposal");
const nullMotel = require("../utils/nullMotel");
const { change } = require("../utils/creditFunction");
const postRouter = (io) => {
  router.post("/reports", verifyToken, async (req, res) => {
    try {
      const { postId, content } = req.body;
      if (!postId)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp thông tin bài viết",
        });
      if (!postId)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cho biết tại sao bạn tố cáo bài viết này",
        });
      const checkPost = await post.findById(postId);
      if (!checkPost)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bài viết" });
      const newReport = new report({
        id1: postId,
        id2: "",
        content: content,
        owner: req.user.id,
        type: "post",
      });
      await newReport.save();

      io.sendDashboardStatisticals("approvals");
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
    const findPost = await post.findById(id);
    try {
      if (!findPost)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bài viết" });
      const liked = findPost.likes.find((item) => {
        return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
      });
      console.log(findPost._id);
      if (!liked)
        return res
          .status(400)
          .json({ success: false, message: "Bạn chưa like bài viết này" });
      await post.findOneAndUpdate(
        { _id: findPost._id },
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
    const findPost = await post.findById(id);

    const type = req.body.params.type;
    console.log({ body: req.body });
    if (typeof type !== "number")
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cho biết cảm xúc của bạn" });
    try {
      if (!findPost)
        return res
          .status(400)
          .json({ success: false, message: "Không tìm thấy bài viết" });
      let isLiked = false;
      if (
        findPost.likes.some((item) => {
          return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
        })
      ) {
        isLiked = true;
        findPost.likes = findPost.likes.filter((item) => {
          return JSON.stringify(item.owner) !== JSON.stringify(req.user.id);
        });
      }

      findPost.likes.push({
        type: parseInt(type),
        owner: req.user.id,
      });
      await findPost.save();
      res.status(200).json({ success: true, message: "Like thành công" });
      if (!isLiked)
        if (JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner)) {
          const getNameUser = await userModel
            .findById(req.user.id)
            .select("name");
          const icons = [
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/love_vil1yw.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/kiss_l4lskr.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/haha_rrtxk7.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/wow_wul2rc.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060681/emoji/cry_r0n92w.png",
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639060680/emoji/angry_iugdix.png",
          ];
          io.notifyToUser(findPost.owner, {
            message: `${getNameUser.name} vừa bày tỏ cảm xúc về bài viết của bạn`,
            url: `/posts/${findPost._id}`,
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
  router.get("/", async (req, res) => {
    try {
      const {
        _user,
        _keysearch,
        _role,
        _subject,
        _type,
        _order,
        _sort,
        _limit,
        _page,
        _block,
        _hashtag,
      } = req.query;
      let posts = await post
        .find({ valid: true })
        .populate("owner")
        .populate("subject")
        .populate("likes.owner", "name rank avatarUrl")
        .populate("motel", "-rate -editor");

      if (typeof _keysearch === "string") {
        posts = posts.filter((item) => {
          const reg = new RegExp(_keysearch, "i");
          return (
            reg.test(removeVietNameseTones(item.title)) ||
            reg.test(item.title) ||
            reg.test(item.owner.unsignedName) ||
            reg.test(item.owner.name) ||
            reg.test(item.owner.username)
          );
        });
      }
      let responsePosts = [];
      for (let i = 0; i < posts.length; i++) {
        const owner = {
          avatarUrl: posts[i].owner.avatarUrl.url,
          name: posts[i].owner.name,
          isAdmin: posts[i].owner.isAdmin,
          _id: posts[i].owner.id,
          credit: posts[i].owner.credit,
          email: posts[i].owner.email,
          posts: posts[i].owner.posts,
          rank: posts[i].owner.rank,
          motels: posts[i].owner.motels,
          school: posts[i].owner.school,
          totalLikes: posts[i].owner.likes.length,
        };
        responsePosts.push({
          ...posts[i]._doc,
          owner: owner,
          numLikes: [
            posts[i].likes.filter((item) => item.type === 0).length,
            posts[i].likes.filter((item) => item.type === 1).length,
            posts[i].likes.filter((item) => item.type === 2).length,
            posts[i].likes.filter((item) => item.type === 3).length,
            posts[i].likes.filter((item) => item.type === 4).length,
            posts[i].likes.filter((item) => item.type === 5).length,
          ],
        });
      }
      for (let i = 0; i < responsePosts.length; i++) {
        if (responsePosts[i].motel) {
          responsePosts[i].motel = {
            ...responsePosts[i].motel._doc,
            thumbnail: responsePosts[i].motel.thumbnail.url,
            images: responsePosts[i].motel.images.map((image) => {
              return image.url;
            }),
          };
        }
      }
      responsePosts = responsePosts.sort((r1, r2) => {
        return new Date(r2.createdAt) - new Date(r1.createdAt);
      });
      if (typeof _user === "string")
        responsePosts = responsePosts.filter((item) => {
          return JSON.stringify(item.owner._id) === JSON.stringify(_user);
        });
      if (typeof _block === "string") {
        let block = false;
        if (_block.toLowerCase() === "true") block = true;
        responsePosts = responsePosts.filter((item) => {
          return item.block === block;
        });
      }
      if (typeof _role === "string")
        responsePosts = responsePosts.filter((item) => {
          let role = true;
          if (_role.toLowerCase() === "user") role = false;
          return item.owner.isAdmin === role;
        });
      if (typeof _subject === "string")
        responsePosts = responsePosts.filter((item) => {
          return JSON.stringify(item.subject._id) === JSON.stringify(_subject);
        });
      if (typeof _type === "string")
        if (!isNaN(parseInt(_type)))
          responsePosts = responsePosts.filter((item) => {
            return item.type === parseInt(_type);
          });
      if (_order && _sort)
        if (_sort === "createdat") {
          if (_order === "asc")
            responsePosts = responsePosts.sort((post1, post2) => {
              return new Date(post1.createdAt) - new Date(post2.createdAt);
            });
          else if (_order === "desc")
            responsePosts = responsePosts.sort((post1, post2) => {
              return new Date(post2.createdAt) - new Date(post1.createdAt);
            });
        } else if (_sort === "like") {
          if ((_order = "asc"))
            responsePosts = responsePosts.sort((post1, post2) => {
              return post1.likes.length - post2.likes.length;
            });
          else if (_order === "desc")
            responsePosts = responsePosts.sort((post1, post2) => {
              return post2.likes.length - post1.likes.length;
            });
        }
      if (_hashtag)
        responsePosts = responsePosts.filter((post) => {
          let count = 0;
          for (let i = 0; i < post.hashTag.length; i++) {
            for (let j = 0; j < _hashtag.length; j++)
              if (post.hashTag[i] == _hashtag[j]) count++;
          }
          return count == _hashtag.length;
        });

      let page = 1;
      let limit = responsePosts.length;
      let totalRows = responsePosts.length;
      if (_page && _limit)
        if (
          typeof parseInt(_page) === "number" &&
          typeof parseInt(_limit) === "number"
        ) {
          limit = parseInt(_limit);
          page = parseInt(_page);
        }
      const cmts = await commentModel.find({});
      responsePosts = responsePosts.slice((page - 1) * limit, limit * page);
      responsePosts = responsePosts.map((item) => {
        return {
          ...item,
          totalLikes: item.likes.length,
          numComments: cmts.filter(
            (cmt) => JSON.stringify(cmt.post) === JSON.stringify(item._id)
          ).length,
        };
      });
      res.status(200).json({
        success: true,
        data: responsePosts,
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
  router.get("/:id", async (req, res) => {
    try {
      const findPost = await post
        .findById(req.params.id)
        .populate("owner")
        .populate("subject")
        .populate("likes.owner", "name avatarUrl rank")
        .populate("motel", "-rate -editor")
        .select("-unsignedTitle");
      if (!findPost)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài viết này",
        });
      if (!findPost.valid)
        return res.status(400).json({
          success: false,
          message: "Bài viết này chưa được duyệt",
        });

      const owner = {
        avatarUrl: findPost.owner.avatarUrl.url,
        name: findPost.owner.name,
        isAdmin: findPost.owner.isAdmin,
        _id: findPost.owner.id,
        credit: findPost.owner.credit,
        email: findPost.owner.email,
        school: findPost.owner.school,
        posts: findPost.owner.posts,
        rank: findPost.owner.rank,
        totalLikes: findPost.owner.likes.length,
        motels: findPost.owner.motels,
      };

      let responsePost = {
        ...findPost._doc,
        owner: owner,
        likes: findPost.likes.map((item) => {
          return {
            ...item._doc,
            owner: { ...item.owner._doc, avatarUrl: item.owner.avatarUrl.url },
          };
        }),
        numLikes: [
          findPost.likes.filter((like) => like.type === 0).length,
          findPost.likes.filter((like) => like.type === 1).length,
          findPost.likes.filter((like) => like.type === 2).length,
          findPost.likes.filter((like) => like.type === 3).length,
          findPost.likes.filter((like) => like.type === 4).length,
          findPost.likes.filter((like) => like.type === 5).length,
        ],
      };
      if (responsePost.motel)
        responsePost.motel = {
          ...responsePost.motel._doc,
          thumbnail: responsePost.motel.thumbnail.url,
          images: responsePost.motel.images.map((image) => {
            return image.url;
          }),
        };
      if (responsePost.motel == null && responsePost.type != 1)
        responsePost.motel = nullMotel;
      const comments = await commentModel.find({ post: responsePost._id });
      responsePost.numComments = comments.length;
      responsePost.totalLikes = responsePost.likes.length;
      responsePost = await proposal(responsePost);
      res.status(200).json({ success: true, data: responsePost });
      await subjectModel.findByIdAndUpdate(findPost.subject._id, {
        $inc: { views: 1 },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Lỗi không xác định" });
    }
  });
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const findPost = await post.findByIdAndDelete(req.params.id);
      if (!findPost)
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy bài viết này",
        });
      if (
        req.user.isAdmin == false &&
        req.user.credit < 701 &&
        JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner)
      )
        return res.status(403).json({
          success: false,
          message: "Bạn không đủ quyền thực hiện hành động này",
        });
      await commentModel.deleteMany({ post: findPost._id });
      await subjectModel.findByIdAndUpdate(findPost.subject, {
        $inc: { posts: -1 },
      });

      io.sendDashboardStatisticals("posts");
      if (
        (req.user.isAdmin == true || req.user.credit > 700) &&
        JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner)
      )
        io.notifyToUser(findPost.owner, {
          message: `Bài viết "${findPost.title}" của bạn đã bị người quản lý xóa`,
          url: `/`,
          imageUrl:
            "https://res.cloudinary.com/dpregsdt9/image/upload/v1639701129/notify/qqorbp63avq7cpiygrxj.png",
        });
      return res.status(200).json({
        success: false,
        message: "Đã xóa bài viết thành công",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  });
  router.patch("/:id", verifyToken, async (req, res) => {
    const findPost = await post.findById(req.params.id);
    if (!findPost)
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy bài viết này",
      });
    const subjectId = findPost.subject.toString();
    const {
      additional,
      school,
      price,
      title,
      content,
      tags,
      block,
      status,
      motel,
    } = req.body;

    if (typeof title === "string") {
      findPost.title = title;
      findPost.unsignedTitle = removeVietNameseTones(title);
    }

    if (
      JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner) &&
      req.user.isAdmin == false
    )
      return res.status(403).json({
        success: false,
        message: "Bạn không đủ quyền thực hiện hành động này",
      });
    if (content) {
      if (typeof content !== "string") {
        return res.status(400).json({
          success: false,
          message: "Thiếu nội dung",
        });
      }
      if (content.length < 20) {
        return res.status(400).json({
          success: false,
          message: "Nội dung quá ngắn",
        });
      }
      findPost.content = content;
    }
    if (tags) {
      if (tags.length > 0)
        findPost.tags = tags.split(",").map((t) => t.replace(/ /g, "").trim());
      else findPost.tags = [];
    }
    if (typeof block === "boolean") findPost.block = block;
    if (typeof status === "boolean") findPost.status = status;

    if (subjectId === "6173ba553c954151dcc8fdf7") {
      // tìm nhà trọ

      if (school) findPost.require.school = school;

      if (price) findPost.require.price = price;

      if (additional) findPost.require.additional = additional;

      try {
        findPost.markModified("require");
        await findPost.save();
        return res.status(200).json({
          success: true,
          message: "Đã cập nhật bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else if (subjectId === "6173ba553c954151dcc8fdf8") {
      //tim ban o ghep
      if (motel) findPost.motel = motel;
      if (additional) findPost.require.additional = additional;
      try {
        findPost.markModified("require");
        await findPost.save();
        return res.status(200).json({
          success: true,
          message: "Đã cập nhật bài bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else if (subjectId === "6173ba553c954151dcc8fdf9") {
      if (motel) findPost.motel = motel;
      try {
        await findPost.save();
        return res.status(200).json({
          success: true,
          message: "Đã cập nhật bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Chuyên mục không hợp lệ" });
    }
  });
  router.post("/", verifyToken, async (req, res) => {
    const {
      subjectId,
      title,
      content,
      price,
      schools,
      additional,
      tags,
      motel,
    } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin về chuyên mục",
      });
    }
    if (typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin tiêu đề bài viết",
      });
    }
    if (typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Thiếu nội dung",
      });
    }
    if (typeof tags !== "string") {
      return res.status(400).json({
        success: false,
        message: "Sai thông tin hashTag",
      });
    }
    let tag;
    tags.length > 0 ? (tag = tags.split(",")) : (tag = []);

    tag = tag.map((t) => (t = t.replace(/ /g, "").trim()));
    tag = tag.map((t) => (t = removeVietNameseTones(t)));
    tag = tag.filter((t) => {
      return t !== "";
    });

    if (subjectId === "6173ba553c954151dcc8fdf7") {
      if (!schools) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp các yêu cầu về nhà trọ bạn muốn tìm",
        });
      }
      let add = additional;
      add.length < 1 || !add.match(/[a-z]/i) ? (add = "") : (add = additional);
      const newPost = new post({
        title,
        unsignedTitle: removeVietNameseTones(title),
        content,
        tags: tag,
        subject: subjectId,
        owner: req.user.id,
        require: {
          price,
          additional: add,
          schools,
        },
        likes: [],
        type: 1,
      });
      if (req.user.isAdmin == true || req.user.credit > 150)
        newPost.valid = true;
      try {
        await newPost.save();
        if (req.user.isAdmin == true || req.user.credit > 150) {
          await userModel.findByIdAndUpdate(newPost.owner, {
            $inc: { posts: 1 },
          });
          await subjectModel.findByIdAndUpdate(subjectId, {
            $inc: { posts: 1 },
          });
          change(req.user.id, 3, io);
          addDone(
            req.user.id,
            "Đăng bài viết mới",
            {
              type: "createdPost",
              subjectId: subjectId,
              title: title,
              content: content,
              postId: newPost._id,
            },
            io
          );

          io.sendDashboardStatisticals("posts");
        }

        return res.status(200).json({
          success: true,
          message: "Đã đăng bài bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else if (subjectId === "6173ba553c954151dcc8fdf8") {
      if (!motel)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp nhà trọ bạn đang tạm trú",
        });

      const newPost = new post({
        title,
        unsignedTitle: removeVietNameseTones(title),
        content,
        tags: tag,
        subject: subjectId,
        owner: req.user.id,
        likes: [],
        require: {
          additional,
        },
        motel,
        type: 2,
      });
      if (req.user.isAdmin == true || req.user.credit > 150)
        newPost.valid = true;
      try {
        await newPost.save();
        if (req.user.isAdmin == true || req.user.credit > 150) {
          await userModel.findByIdAndUpdate(newPost.owner, {
            $inc: { posts: 1 },
          });
          await subjectModel.findByIdAndUpdate(subjectId, {
            $inc: { posts: 1 },
          });
          change(req.user.id, 3, io);
          addDone(
            req.user.id,
            "Đăng bài viết mới",
            {
              type: "createdPost",
              subjectId: subjectId,
              title: title,
              content: content,
              postId: newPost._id,
            },
            io
          );

          io.sendDashboardStatisticals("posts");
        }
        return res.status(200).json({
          success: true,
          message: "Đã đăng bài bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else if (subjectId === "6173ba553c954151dcc8fdf9") {
      if (!motel)
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp nhà trọ bạn muốn review",
        });

      const newPost = new post({
        title,
        unsignedTitle: removeVietNameseTones(title),
        content,
        tags: tag,
        subject: subjectId,
        owner: req.user.id,
        likes: [],
        motel,
        type: 3,
      });
      if (req.user.isAdmin == true || req.user.credit > 150)
        newPost.valid = true;
      try {
        await newPost.save();
        if (req.user.isAdmin == true || req.user.credit > 150) {
          await userModel.findByIdAndUpdate(newPost.owner, {
            $inc: { posts: 1 },
          });
          await subjectModel.findByIdAndUpdate(subjectId, {
            $inc: { posts: 1 },
          });
          change(req.user.id, 3, io);
          addDone(
            req.user.id,
            "Đăng bài viết mới",
            {
              type: "createdPost",
              subjectId: subjectId,
              title: title,
              content: content,
              postId: newPost._id,
            },
            io
          );

          io.sendDashboardStatisticals("posts");
        }
        return res.status(200).json({
          success: true,
          message: "Đã đăng bài bài viết thành công",
        });
      } catch (err) {
        console.log(err);
        //    await post.findByIdAndDelete(newPost._id);
        return res.status(500).json({
          success: false,
          message: "Lỗi không xác định",
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Chuyên mục không hợp lệ" });
    }
  });
  return router;
};

module.exports = postRouter;
