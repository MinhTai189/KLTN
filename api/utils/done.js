const comment = require("../models/comment");
const motel = require("../models/motel");
const post = require("../models/post");
const subject = require("../models/subject");
const user = require("../models/user");

const add = async (userId, title, params, io) => {
  let content = "",
    url = "";
  if (params.type === "createdPost") {
    //params: type, subjectId, title, content
    const getSubject = await subject.findById(params.subjectId);
    content += `Bài viết "${params.title}" trong chuyên mục ${
      getSubject.name
    }. Nội dung: "${params.content.slice(0, 60)} . . ."`;
    url += `/posts/${params.postId}`;
  } else if (params.type === "createdComment") {
    //params: type, postId, content
    const getPost = await post.findById(params.postId).populate("owner");
    content += `Đã bình luận bài viết của "${getPost.owner.name}" trong bài ${
      getPost.title
    }. Nội dung: "${params.content.slice(0, 34)} . . ."`;
    url += `/posts/${params.postId}`;
  } else if (params.type === "rating") {
    //params: motelId content star
    const getMotel = await motel.findById(params.motelId);
    content += `Đã đánh giá "${
      getMotel.name
    }". Nội dung: "${params.content.slice(0, 34)} . . .". Số sao: ${
      params.star
    }`;
    url += `/motels/${params.motelId}`;
  } else if (params.type === "createdMotel") {
    //params: name desc motelId
    content += `Đã đăng "${params.name}". Mô tả: "${params.desc.slice(
      0,
      60
    )} . . .".`;
    url += `/motels/${params.motelId}`;
  } else if (params.type === "updatedMotel") {
    //params: name desc motelId
    content += `Đã chỉnh sửa "${
      params.name
    }". Các thông tin: ${params.edited.substring(19)}`;
    url += `/motels/${params.motelId}`;
  } else if (params.type === "repComment") {
    //params: name desc
    const getComment = await comment
      .findById(params.commentId)
      .populate("owner");
    content += `Trả lời bình luận của "${
      getComment.owner.name
    }". Nội dung: "${params.content.slice(0, 34)} . . ."`;
    url += `/posts/${getComment.post}`;
  }
  const userDone = await user.findOneAndUpdate(
    {
      _id: userId,
      deleted: false,
    },
    { $push: { done: { title, content, createdAt: Date.now(), url: url } } }
  );
  console.log(userDone);
  io.sendDashboardRecent("activities");
};

module.exports = add;
