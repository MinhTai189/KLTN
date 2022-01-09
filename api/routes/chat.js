const express = require("express");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const user = require("../models/user");
const groupChat = require("../models/groupChat");
const upload = require("../middleware/upload");
const { default: axios } = require("axios");
const router = express.Router();
const cheerio = require("cheerio");
const url = require("url");
const chatRouter = (io) => {
  router.post("/groups", verifyToken, async (req, res) => {
    try {
      let { members, name, type } = req.body;
      if (
        !members.some(
          (item) => JSON.stringify(item) === JSON.stringify(req.user.id)
        )
      )
        members = [...members, req.user.id];

      const newGroupChat = new groupChat({
        name,
        members,
        type,
        messages: [
          {
            type: "text",
            content: "Đã tạo nhóm chat mới",
            owner: req.user.id,
            seen: [req.user.id],
          },
        ],
      });
      await newGroupChat.save();

      res
        .status(200)
        .json({ message: "Thành công", success: true, data: newGroupChat._id });
      const newGroup = await groupChat
        .findById(newGroupChat._id)
        .populate(
          "members",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .populate(
          "messages.owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      for (let i = 0; i < newGroup.members.length; i++) {
        io.membersOnChangeAddToGroup(
          newGroup._id,
          newGroup,
          newGroup.members[i]._id
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  router.get("/groups", verifyToken, async (req, res) => {
    // Lấy tất cả room từ accessToken về
    const userId = req.user.id;
    const getAllGroup = await groupChat
      .find({ members: userId })
      .populate(
        "members",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      )
      .populate(
        "messages.owner",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      );

    let responseGroupsChat = [
      ...getAllGroup.map((item) => {
        let name = item.name;
        if (item.type === "private") {
          if (
            item.members.find(
              (mem) => JSON.stringify(mem._id) !== JSON.stringify(req.user.id)
            )
          )
            name = item.members.find(
              (mem) => JSON.stringify(mem._id) !== JSON.stringify(req.user.id)
            ).name;
        }
        return {
          ...item._doc,
          name: name,
          members: item.members.map((member) => {
            return {
              ...member._doc,
              avatarUrl: member.avatarUrl.url,
              totalLikes: member.likes.length,
            };
          }),
          totalMembers: item.members.length,
          lastMessage: item.messages[item.messages.length - 1],
          messages: undefined,
          unseen: item.messages.filter((message) => {
            return !message.seen.some(
              (m) => JSON.stringify(m) === JSON.stringify(req.user.id)
            );
          }).length,
          ononlines: io.getListOnlineByGroupId(item._id),
        };
      }),
    ].sort((g1, g2) => new Date(g2.updatedAt) - new Date(g1.updatedAt));
    let limit = responseGroupsChat.length;
    const { _limit } = req.query;
    if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
    return res
      .status(200)
      .json({ data: responseGroupsChat.slice(0, limit), success: true });
  });

  router.get("/groups/messages/:groupId", verifyToken, async (req, res) => {
    /*
    type: "image", "gif", "text", "link"
    
    //Nếu là image thì có thuộc tính một mảng urlImages:[String,String,...];

    //nêú là gif thì có thuộc tính urlGif:String là url của ảnh gif

    //nếu là text thì sẽ có thuộc tính content:String 

    //nếu là link sẽ có thuộc tính dataLink:{  url: "",
                                              domain: "",
                                              title: "",
                                              img: "link image",
                                              description: ""}
      sẽ có trường hợp đ có title, img, description

    */
    console.log("get messages");
    const groupId = req.params.groupId;
    const getGroup = await groupChat
      .findOne({
        _id: groupId,
        members: req.user.id,
      })
      .populate(
        "messages.owner",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      )
      .populate(
        "messages.seen",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      );
    if (!getGroup)
      return res
        .status(400)
        .json({ message: "Bạn không tham gia nhóm này", success: false });

    const responseMessages = [
      ...getGroup.messages.map((message) => {
        const status = message.seen.length > 1;

        if (message.type === "image") {
          return {
            ...message._doc,
            urlImages: message.urlImages.map((image) => image.url),
            owner: {
              ...message.owner._doc,
              avatarUrl: message.owner.avatarUrl.url,
              totalLikes: message.owner.length,
            },
            seen: message.seen.map((userseen) => {
              return {
                ...userseen._doc,
                avatarUrl: userseen.avatarUrl.url,
                totalLikes: userseen.likes.length,
              };
            }),

            status: status,
          };
        } else if (message.type === "gif") {
          return {
            ...message._doc,
            owner: {
              ...message.owner._doc,
              avatarUrl: message.owner.avatarUrl.url,
              totalLikes: message.owner.length,
            },
            seen: message.seen.map((userseen) => {
              return {
                ...userseen._doc,
                avatarUrl: userseen.avatarUrl.url,
                totalLikes: userseen.likes.length,
              };
            }),
            status: status,
          };
        } else
          return {
            ...message._doc,
            owner: {
              ...message.owner._doc,
              avatarUrl: message.owner.avatarUrl.url,
              totalLikes: message.owner.length,
            },
            seen: message.seen.map((userseen) => {
              return {
                ...userseen._doc,
                avatarUrl: userseen.avatarUrl.url,
                totalLikes: userseen.likes.length,
              };
            }),
            status: status,
          };
      }),
    ];

    let limit = responseMessages.length;

    let page = 1;
    const { _limit, _page } = req.query;
    const totalRows = responseMessages.length;
    if (!isNaN(parseInt(_limit))) limit = parseInt(_limit);
    if (!isNaN(parseInt(_page))) page = parseInt(_page);
    res.status(200).json({
      data: responseMessages.slice(limit * (page - 1), page * limit),
      pagination: { _page: page, _limit: limit, _totalRows: totalRows },
      success: true,
    });
  });
  function linkify(text) {
    var urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.match(urlRegex);
  }
  router.post("/groups/messages/:groupId", verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
    // body gửi lên là một object

    /*
    type: "image", "gif", "text"
    
    //Nếu là image thì thêm thuộc tính một mảng urlImages:[{url,public_id },{url,public_id},...];

    //nêú là gif thì thêm thuộc tính urlGif:String là url của ảnh gif

    //nếu là text thì sẽ có thuộc tính content:String nếu text có link sẽ tự chuyển kiểu là "link"

    */
    let type = req.body.type;
    if (!type)
      return res.status(400).json({
        message: "Thiếu type",
        success: false,
      });
    let dataLink = undefined;
    if (req.body.content) {
      const tolinkify = linkify(req.body.content);

      if (tolinkify) {
        const getLink = tolinkify[0];

        const html = await axios.get(getLink);

        const $ = cheerio.load(html.data);
        const metaTagData = {
          url: getLink,
          domain: url.parse(getLink).hostname,
          title: $('meta[name="title"]').attr("content"),
          img: $('meta[name="image"]').attr("content"),
          description: $('meta[name="description"]').attr("content"),
        };
        if (!metaTagData.title)
          metaTagData.title = $('meta[property="og:title"]').attr("content");
        if (!metaTagData.img)
          metaTagData.img = $('meta[property="og:image"]').attr("content");
        if (!metaTagData.description)
          metaTagData.description = $('meta[property="og:description"]').attr(
            "content"
          );
        if (
          !metaTagData.img ||
          !metaTagData.title ||
          !metaTagData.description
        ) {
        } else {
          dataLink = metaTagData;
          type = "link";
        }
      }
    }
    const response = await groupChat
      .findOneAndUpdate(
        { _id: groupId, members: req.user.id },
        {
          $push: {
            messages: {
              ...req.body,
              type: type,
              dataLink,
              owner: req.user.id,
              seen: [req.user.id],
            },
          },
        },
        { new: true }
      )
      .populate(
        "messages.owner",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      )
      .populate(
        "messages.seen",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      );
    if (response) {
      const newMessage = response.messages[response.messages.length - 1];
      io.sendMessage(response._id, newMessage);
    } else {
      return res.status(500).json({
        message: "Bạn không tham gia nhóm này",
        success: false,
      });
    }

    res.status(200).json({
      message: "Thành công",
      success: true,
    });
  });
  router.delete("/groups/:groupId", verifyToken, async (req, res) => {
    // rời nhóm
    try {
      const groupId = req.params.groupId;
      const leaveGroup = await groupChat
        .findByIdAndUpdate(
          groupId,
          {
            $pull: {
              members: req.user.id,
            },
            $push: {
              messages: {
                type: "text",
                content: "Đã rời nhóm",
                owner: req.user.id,
                seen: [req.user.id],
              },
            },
          },
          { new: true }
        )
        .populate(
          "messages.owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .populate(
          "messages.seen",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      if (!leaveGroup)
        return res
          .status(400)
          .json({ message: "Không tìm thấy nhóm chat", success: false });
      res.status(200).json({ message: "Rời nhóm thành công", success: true });
      if (leaveGroup.members.length == 0) {
        groupChat.findByIdAndDelete(groupId);

        groupChat.messages.forEach((message) => {
          if (message.dataUrl)
            if (message.dataUrl.public_id)
              upload.unlink(message.dataUrl.public_id);
        });
      }
      io.membersOnChangeLeave(leaveGroup._id, leaveGroup, req.user.id);
      io.sendMessage(
        leaveGroup._id,
        leaveGroup.messages[leaveGroup.messages.length - 1]
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  router.post("/groups/add-members/:groupId", verifyToken, async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const members = req.body.members; // mảng id members mới
      const arrayUser = await user
        .find({
          $or: members.map((member) => {
            return { members: member };
          }),
        })
        .select("name");
      const addMemberGroup = await groupChat
        .findByIdAndUpdate(
          groupId,
          {
            $push: {
              members: { $each: members },
              messages: {
                type: "text",
                content:
                  "Đã thêm " +
                  arrayUser.map((item) => item.name).join(", ") +
                  " vào nhóm",
                owner: req.user.id,
                seen: [req.user.id],
              },
            },
          },
          { upsert: true }
        )
        .populate(
          "members",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .populate(
          "messages.owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        )
        .populate(
          "messages.seen",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      if (!addMemberGroup)
        return res
          .status(400)
          .json({ message: "Không tìm thấy nhóm chat", success: false });
      res.status(200).json({ message: "Thành công", success: true });
      for (let i = 0; i < members.length; i++) {
        io.membersOnChangeAddToGroup(
          addMemberGroup._id,
          addMemberGroup,
          members
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  return router;
};

module.exports = chatRouter;
