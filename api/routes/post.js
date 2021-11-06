const express = require("express");
const router = express.Router();
const removeVietNameseTones = require("../middleware/removeVietnameseTones");
const subjectModel = require("../models/subject");
const userModel = require("../models/user");
const commentModel = require("../models/comment");
const schoolModel = require("../models/school");
const reviewModel = require("../models/review");
const post = require("../models/post");
const objectId = require("mongoose").ObjectId;
const verifyToken = require("../middleware/verifyToken");
const { unlink } = require("../middleware/upload");

router.delete("/likes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const findPost = await post.findById(id);
  try {
    if (!findPost)
      res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    const liked = findPost.likes.find((item) => {
      return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
    });
    console.log(findPost._id);
    if (!liked)
      res
        .status(400)
        .json({ success: false, message: "Bạn chưa like bài viết này" });
    await post.findOneAndUpdate(
      { _id: findPost._id },
      { $pull: { likes: { _id: liked._id } } }
    );

    res.status(200).json({ success: true, message: "unlike thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});
router.post("/likes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const findPost = await post.findById(id);
  const type = req.body.type;
  try {
    if (!findPost)
      res
        .status(400)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    if (
      findPost.likes.some((item) => {
        return JSON.stringify(item.owner) === JSON.stringify(req.user.id);
      })
    )
      res.status(400).json({ success: false, message: "Đã like bài viết rồi" });
    findPost.likes.push({
      type: type,
      owner: req.user.id,
    });
    await findPost.save();
    res.status(200).json({ success: true, message: "Like thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Lỗi không xác định" });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      _user,
      _keysearch,
      _role,
      _subject,
      _order,
      _sort,
      _limit,
      _page,
      _hashtag,
    } = req.query;
    let posts = await post
      .find({ valid: true })
      .populate("owner")
      .populate("subject")
      .populate("likes.owner", "name")
      .select("-unsignedTitle")
      .populate("school", "-nameDistricts");

    if (typeof _keysearch === "string") {
      posts = posts.filter((item) => {
        const reg = new RegExp(_keysearch, "i");
        return (
          reg.test(item.unsignedTitle) ||
          reg.test(item.title) ||
          reg.test(item.owner.unsignedName) ||
          reg.test(item.owner.name) ||
          reg.test(item.owner.username)
        );
      });
    }
    let responsePosts = [];
    for (let i = 0; i < posts.length; i++) {
      const ownerSchool = await schoolModel
        .findOne({ codeName: posts[i].owner.school })
        .select("-nameDistricts");
      const owner = {
        avatarUrl: posts[i].owner.avatarUrl.url,
        name: posts[i].owner.name,
        isAdmin: posts[i].owner.isAdmin,
        _id: posts[i].owner.id,
        credit: posts[i].owner.credit,
        email: posts[i].owner.email,
        school: ownerSchool,
        posts: posts[i].owner.posts,
      };
      responsePosts.push({ ...posts[i]._doc, owner: owner });
    }
    if (typeof _user === "string")
      responsePosts = responsePosts.filter((item) => {
        return JSON.stringify(item.owner._id) === JSON.stringify(_user);
      });
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
    if (_order && _sort)
      if (_sort === "createdat") {
        if ((_order = "asc"))
          responsePosts = responsePosts.sort((post1, post2) => {
            return new Date(post1.createdAt) - new Date(post2.createdAt);
          });
        else if ((_order = "desc"))
          responsePosts = responsePosts.sort((post1, post2) => {
            return new Date(post2.createdAt) - new Date(post1.createdAt);
          });
      } else if (_sort === "like") {
        if ((_order = "asc"))
          responsePosts = responsePosts.sort((post1, post2) => {
            return post1.likes.length - post2.likes.length;
          });
        else if ((_order = "desc"))
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
    responsePosts = responsePosts.slice((page - 1) * limit, limit * page);
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
      .populate("likes.owner", "name")
      .select("-unsignedTitle")
      .populate("school", "-nameDistricts");
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
    const ownerSchool = await schoolModel
      .findOne({ codeName: findPost.owner.school })
      .select("-nameDistricts");
    const owner = {
      avatarUrl: findPost.owner.avatarUrl.url,
      name: findPost.owner.name,
      isAdmin: findPost.owner.isAdmin,
      _id: findPost.owner.id,
      credit: findPost.owner.credit,
      email: findPost.owner.email,
      school: ownerSchool,
      posts: findPost.owner.posts,
    };
    let images = [];
    for (let i = 0; i < findPost.images.length; i++)
      images.push(findPost.images[i].url);
    let likes = findPost.likes.sort((post1, post2) => {
      return post1.type - post2.type;
    });
    let responsePost = {
      ...findPost._doc,
      owner: owner,
      images: images,
      likes: likes,
    };

    if (findPost.subject._id.toString() === "6173ba553c954151dcc8fdf9") {
      responsePost.review = await reviewModel.findOne({ post: findPost._id });
    }
    res.status(200).json({ success: true, data: responsePost });
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
      JSON.stringify(req.user.id) !== JSON.stringify(findPost.owner) &&
      req.user.isAdmin == false
    )
      return res.status(403).json({
        success: false,
        message: "Bạn không đủ quyền thực hiện hành động này",
      });
    if (findPost.subject.toString() === "6173ba553c954151dcc8fdf9")
      await reviewModel.findOneAndDelete({ post: findPost._id });
    await commentModel.deleteMany({ post: findPost._id });
    await subjectModel.findByIdAndUpdate(findPost.subject, {
      $inc: { posts: -1 },
    });
    for (let i = 0; i < findPost.images.length; i++) {
      await unlink(findPost.images[i].public_id);
    }
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

  const subjectId = findPost.subject.toString();
  const { require, title, content, hashTag, school, review, block, status } =
    req.body;
  let { images } = req.body;
  if (typeof title === "string") {
    findPost.title = title;
    findPost.unsignedTitle = removeVietNameseTones(title);
  }
  let newImg = [];
  let oldImg = [];
  if (images) if (!Array.isArray(images)) images = [images];
  if (images)
    if (Array.isArray(images))
      for (let i = 0; i < images.length; i++) {
        typeof images[i] === "object"
          ? newImg.push(images[i])
          : oldImg.push(images[i]);
      }
  if (!findPost)
    return res.status(400).json({
      success: false,
      message: "Không tìm thấy bài viết này",
    });
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
      for (let i = 0; i < newImg.length; i++) {
        await unlink(newImg[i].public_id);
      }
      return res.status(400).json({
        success: false,
        message: "Thiếu nội dung",
      });
    }
    if (content.length < 100) {
      for (let i = 0; i < newImg.length; i++) {
        await unlink(newImg[i].public_id);
      }
      return res.status(400).json({
        success: false,
        message: "Nội dung quá ngắn",
      });
    }
    findPost.content = content;
  }
  if (Array.isArray(hashTag) == true) findPost.hashTag = hashTag;
  if (typeof block === "boolean") findPost.block = block;
  if (typeof status === "boolean") findPost.status = status;
  let deleteImg = [];
  if (newImg.length > 0) {
    let newImages = [];
    for (let i = 0; i < findPost.images.length; i++) {
      let del = true;
      for (let j = 0; j < oldImg.length; j++) {
        if (oldImg[j] === findPost.images[i].url) {
          newImages.push(findPost.images[i]);
          del = false;
        }
      }
      if (del == true) deleteImg.push({ ...findPost.images[i]._doc });
    }
    newImages = newImages.concat(newImg);
    findPost.images = newImages;
  }
  if (subjectId === "6173ba553c954151dcc8fdf7") {
    // tìm nhà trọ
    if (Array.isArray(school) == true) {
      for (let i = 0; i < school.length; i++) {
        const check = await schoolModel.exists({ _id: school[i] });
        if (!check) {
          for (let i = 0; i < newImg.length; i++) {
            await unlink(newImg[i].public_id);
          }
          return res.status(400).json({
            success: false,
            message: "Không tìm thấy trường",
          });
        }
      }
      findPost.school = school;
    }
    if (Array.isArray(require)) {
      for (let i = 0; i < require.length; i++) {
        if (typeof require[i] !== "string") {
          for (let i = 0; i < newImg.length; i++) {
            await unlink(newImg[i].public_id);
          }
          return res
            .status(400)
            .json({ success: false, message: "Sai dữ liệu về yêu cầu" });
        }
      }
      findPost.require = require;
    }

    try {
      await findPost.save();
      for (let i = 0; i < deleteImg.length; i++) {
        await unlink(deleteImg[i].public_id);
      }
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật bài viết thành công",
      });
    } catch (err) {
      console.log(err);
      if (newImg.length > 0)
        for (let i = 0; i < newImg.length; i++)
          await unlink(newImg[i].public_id);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdf8") {
    if (Array.isArray(school) == true) {
      for (let i = 0; i < school.length; i++) {
        const check = await schoolModel.exists({ _id: school[i] });
        if (!check) {
          for (let i = 0; i < newImg.length; i++) {
            await unlink(newImg[i].public_id);
          }
          return res.status(400).json({
            success: false,
            message: "Không tìm thấy trường ",
          });
        }
      }
      findPost.school = school;
    }
    try {
      await findPost.save();
      for (let i = 0; i < deleteImg.length; i++) {
        await unlink(deleteImg[i].public_id);
      }
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật bài bài viết thành công",
      });
    } catch (err) {
      console.log(err);
      for (let i = 0; i < newImg.length; i++) {
        await unlink(newImg[i].public_id);
      }
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdf9") {
    if (typeof review === "object") {
      if (
        typeof review.cleanup !== "number" &&
        typeof review.road !== "number" &&
        typeof review.price !== "number" &&
        typeof review.quiet !== "number" &&
        typeof review.beauty !== "number"
      ) {
        for (let i = 0; i < newImg.length; i++) {
          await unlink(newImg[i].public_id);
        }
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp đúng thông tin về các thông số đánh giá",
        });
      }
      const findReview = await reviewModel.findOne({ post: findPost._id });
      if (!findReview) {
        for (let i = 0; i < newImg.length; i++) {
          await unlink(newImg[i].public_id);
        }
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy thông tin review",
        });
      }
      if (typeof review.beauty === "number") findReview.beauty = review.beauty;
      if (typeof review.quiet === "number") findReview.quiet = review.quiet;
      if (typeof review.price === "number") findReview.price = review.price;
      if (typeof review.road === "number") findReview.road = review.road;
      if (typeof review.cleanup === "number")
        findReview.cleanup = review.cleanup;
      await findReview.save();
    }

    try {
      await findPost.save();
      for (let i = 0; i < deleteImg.length; i++) {
        await unlink(deleteImg[i].public_id);
      }
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < newImg.length; i++) {
        await unlink(newImg[i].public_id);
      }
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdfa") {
    try {
      await findPost.save();
      for (let i = 0; i < deleteImg.length; i++) {
        await unlink(deleteImg[i].public_id);
      }
      return res.status(200).json({
        success: true,
        message: "Đã cập nhật bài bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < newImg.length; i++) {
        await unlink(newImg[i].public_id);
      }
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else {
    for (let i = 0; i < newImg.length; i++) {
      await unlink(newImg[i].public_id);
    }
    return res
      .status(400)
      .json({ success: false, message: "Chuyên mục không hợp lệ" });
  }
});
router.post("/", verifyToken, async (req, res) => {
  const { subject, title, content, require, hashTag, school, review } =
    req.body;
  let { images } = req.body;
  const subjectId = subject;
  if (images) if (!Array.isArray(images)) images = [images];
  if (images) {
    if (Array.isArray(images) == true) {
      for (let i = 0; i < images.length; i++) {
        if (!images[i].url || !images[i].public_id)
          return res.status(400).json({
            success: false,
            message: "Vui lòng xem lại hình ảnh gửi lên",
          });
      }
    }
  } else images = [];

  if (!subjectId) {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin về chuyên mục",
    });
  }
  if (typeof title !== "string") {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin tiêu đề bài viết",
    });
  }
  if (typeof content !== "string") {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res.status(400).json({
      success: false,
      message: "Thiếu nội dung",
    });
  }
  if (content.length < 100) {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res.status(400).json({
      success: false,
      message: "Nội dung quá ngắn",
    });
  }
  if (Array.isArray(hashTag) == false) {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res.status(400).json({
      success: false,
      message: "Sai thông tin hashTag",
    });
  }
  if (subjectId === "6173ba553c954151dcc8fdf7") {
    // tìm nhà trọ
    if (school)
      if (Array.isArray(school) == false) {
        for (let i = 0; i < images.length; i++) {
          await unlink(images[i].public_id);
        }
        return res.status(400).json({
          success: false,
          message:
            "Vui lòng cung cấp ít nhất một trường gần nhà trọ bạn muốn tìm",
        });
      }
    if (!require) {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      return res.status(400).json({
        success: false,
        message: "Yêu cầu là ít nhất mảng rỗng",
      });
    }

    for (let i = 0; i < school.length; i++) {
      const check = await schoolModel.exists({ _id: school[i] });
      if (!check) {
        for (let i = 0; i < images.length; i++) {
          await unlink(images[i].public_id);
        }
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy trường này",
        });
      }
    }
    const newPost = new post({
      title,
      unsignedTitle: removeVietNameseTones(title),
      content,
      school,
      hashTag,
      subject: subjectId,
      owner: req.user.id,
      require,
      likes: [],
      images,
    });
    if (req.user.isAdmin) newPost.valid = true;
    try {
      await newPost.save();
      if (req.user.isAdmin) {
        await userModel.findByIdAndUpdate(newPost.owner, {
          $inc: { posts: 1 },
        });
        await subjectModel.findByIdAndUpdate(subjectId, {
          $inc: { posts: 1 },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Đã đăng bài bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdf8") {
    let s = [];
    if (school)
      if (Array.isArray(school) == true) {
        for (let i = 0; i < school.length; i++) {
          const check = await schoolModel.exists({ _id: school[i] });
          if (!check) {
            for (let i = 0; i < images.length; i++) {
              await unlink(images[i].public_id);
            }
            return res.status(400).json({
              success: false,
              message: "Không tìm thấy trường này",
            });
          }
        }
        s = school;
      }

    const newPost = new post({
      title,
      unsignedTitle: removeVietNameseTones(title),
      content,
      school: s,
      hashTag,
      subject: subjectId,
      owner: req.user.id,
      likes: [],
      images,
    });
    if (req.user.isAdmin) newPost.valid = true;
    try {
      await newPost.save();
      if (req.user.isAdmin) {
        await userModel.findByIdAndUpdate(newPost.owner, {
          $inc: { posts: 1 },
        });
        await subjectModel.findByIdAndUpdate(subjectId, {
          $inc: { posts: 1 },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Đã đăng bài bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdf9") {
    if (typeof review === "object") {
      if (
        !(
          typeof review.cleanup === "number" &&
          typeof review.road === "number" &&
          typeof review.price === "number" &&
          typeof review.quiet === "number" &&
          typeof review.beauty === "number"
        )
      ) {
        for (let i = 0; i < images.length; i++) {
          await unlink(images[i].public_id);
        }
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp đúng thông tin về các thông số đánh giá",
        });
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đúng thông tin về các thông số đánh giá",
      });
    }
    const newPost = new post({
      title,
      unsignedTitle: removeVietNameseTones(title),
      content,
      hashTag,
      subject: subjectId,
      owner: req.user.id,
      likes: [],
      images,
      school: [],
    });
    const newReview = new reviewModel({
      post: newPost._id,
      cleanup: review.cleanup,
      beauty: review.beauty,
      road: review.road,
      quiet: review.road,
      price: review.road,
    });
    if (req.user.isAdmin) newPost.valid = true;
    try {
      await newPost.save();
      await newReview.save();
      if (req.user.isAdmin) {
        await userModel.findByIdAndUpdate(newPost.owner, {
          $inc: { posts: 1 },
        });
        await subjectModel.findByIdAndUpdate(subjectId, {
          $inc: { posts: 1 },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Đã đăng bài bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      console.log(err);
      await post.findByIdAndDelete(newPost._id);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else if (subjectId === "6173ba553c954151dcc8fdfa") {
    const newPost = new post({
      title,
      unsignedTitle: removeVietNameseTones(title),
      content,
      hashTag,
      subject: subjectId,
      owner: req.user.id,
      likes: [],
      images,
      school: [],
    });
    if (req.user.isAdmin) newPost.valid = true;
    try {
      await newPost.save();
      if (req.user.isAdmin) {
        await userModel.findByIdAndUpdate(newPost.owner, {
          $inc: { posts: 1 },
        });
        await subjectModel.findByIdAndUpdate(subjectId, {
          $inc: { posts: 1 },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Đã đăng bài bài viết thành công",
      });
    } catch (err) {
      for (let i = 0; i < images.length; i++) {
        await unlink(images[i].public_id);
      }
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Lỗi không xác định",
      });
    }
  } else {
    for (let i = 0; i < images.length; i++) {
      await unlink(images[i].public_id);
    }
    return res
      .status(400)
      .json({ success: false, message: "Chuyên mục không hợp lệ" });
  }
});
module.exports = router;
