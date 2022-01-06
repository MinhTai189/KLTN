const express = require("express");
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const verifyToken = require("../middleware/verifyToken");
const user = require("../models/user");
const groupChat = require("../models/groupChat");
const upload = require("../middleware/upload");
const router = express.Router();

const chatRouter = (io) => {
  router.post("/groups", verifyToken, async (req, res) => {
    let { members, name, type } = req.body;
    if (
      !members.some(
        (item) => JSON.stringify(item) === JSON.stringify(req.user.id)
      )
    )
      members = [...members, req.user.id];
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp tên nhóm chat" });
    const newGroupChat = new groupChat({
      name,
      members,
      type,
      messages: [
        {
          type: "text",
          content: { text: "Đã tạo nhóm chat mới" },
          owner: req.user.id,
          seen: [req.user.id],
        },
      ],
    });
    await newGroupChat.save();
    res.status(200).json({ message: "Thành công", success: true });
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
          lastMessage: item.messages[item.messages.length - 1].createdAt,
          messages: item.messages.map((message) => {
            const status = message.length > 1;
            if (message.dataUrl) {
              let dataUrl = message.dataUrl;
              if (
                message.type === "image" ||
                message.type === "gif" ||
                message.type === "video"
              )
                dataUrl = message.dataUrl.url;
              return {
                ...message._doc,
                content: { ...message.content._doc, dataUrl: dataUrl },
                owner: {
                  ...message.owner._doc,
                  avatarUrl: message.owner.avatarUrl.url,
                  totalLikes: message.owner.length,
                },
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
                status: status,
              };
          }),
          unseen: item.messages.filter((message) => {
            return !message.seen.some(
              (m) => JSON.stringify(m) === JSON.stringify(req.user.id)
            );
          }).length,
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
  router.get("/groups/:groupId", verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
    console.log(groupId);
    const getGroup = await groupChat
      .findOne({
        _id: groupId,
        members: req.user.id,
      })
      .populate(
        "members",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      )
      .populate(
        "messages.owner",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      );
    if (!getGroup)
      return res
        .status(400)
        .json({ message: "Bạn không tham gia nhóm này", success: false });
    let name = getGroup.name;
    if (getGroup.type === "private") {
      if (
        getGroup.members.find(
          (mem) => JSON.stringify(mem._id) !== JSON.stringify(req.user.id)
        )
      )
        name = getGroup.members.find(
          (mem) => JSON.stringify(mem._id) !== JSON.stringify(req.user.id)
        ).name;
    }
    const responseGroup = {
      ...getGroup._doc,
      name: name,
      members: [
        ...getGroup.members.map((member) => {
          return {
            ...member._doc,
            avatarUrl: member.avatarUrl.url,
            totalLikes: member.likes.length,
          };
        }),
      ],
      totalMembers: getGroup.members.length,
      messages: [
        ...getGroup.messages.map((message) => {
          const status = message.seen.length > 1;
          if (message.dataUrl) {
            let dataUrl = message.dataUrl;
            if (
              message.type === "image" ||
              message.type === "gif" ||
              message.type === "video"
            )
              dataUrl = message.dataUrl.url;
            return {
              ...message._doc,
              content: { ...message.content._doc, dataUrl: dataUrl },
              owner: {
                ...message.owner._doc,
                avatarUrl: message.owner.avatarUrl.url,
                totalLikes: message.owner.length,
              },
              status: status,
            };
          } else {
            return {
              ...message._doc,
              owner: {
                ...message.owner._doc,
                avatarUrl: message.owner.avatarUrl.url,
                totalLikes: message.owner.length,
              },
              status: status,
            };
          }
        }),
      ],
      unseen: getGroup.messages.filter((message) => {
        return !message.seen.some(
          (m) => JSON.stringify(m) === JSON.stringify(req.user.id)
        );
      }).length,
    };
    res.status(200).json({ data: responseGroup, success: true });
  });
  router.get("/groups/messages/:groupId", verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
    const getGroup = await groupChat
      .findOne({
        _id: groupId,
        members: req.user.id,
      })
      .populate(
        "messages.owner",
        "avatarUrl name isAdmin _id credit email posts motels rank school likes"
      );
    if (!getGroup)
      return res
        .status(400)
        .json({ message: "Bạn không tham gia nhóm này", success: false });

    const responseMessages = [
      ...getGroup.messages.map((message) => {
        const status = message.seen.length > 1;
        if (message.dataUrl) {
          let dataUrl = message.dataUrl;
          if (
            message.type === "gif" ||
            message.type === "image" ||
            message.type === "video"
          )
            dataUrl = message.dataUrl.url;
          return {
            ...message._doc,
            content: { ...message.content._doc, dataUrl: dataUrl },
            owner: {
              ...message.owner._doc,
              avatarUrl: message.owner.avatarUrl.url,
              totalLikes: message.owner.length,
            },
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
            status: status,
          };
      }),
    ];
    res.status(200).json({ data: responseMessages, success: true });
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
                content: {
                  text: "Đã rời nhóm",
                },
                owner: req.user.id,
                seen: [],
              },
            },
          },
          { new: true }
        )
        .populate(
          "messages.owner",
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
      io.membersOnChange(
        JSON.stringify(leaveGroup._id),
        {
          ...leaveGroup.messages[leaveGroup.messages.length - 1]._doc,
          status: false,
          owner: {
            ...leaveGroup.messages[leaveGroup.messages.length - 1].owner._doc,
            avatarUrl:
              leaveGroup.messages[leaveGroup.messages.length - 1].owner
                .avatarUrl.url,
            totalLikes:
              leaveGroup.messages[leaveGroup.messages.length - 1].owner.likes
                .length,
          },
        },
        leaveGroup
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
      const addMemberGroup = await groupChat.findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: { $each: members },
            messages: {
              content: {
                type: "text",
                text:
                  "Đã thêm " +
                  arrayUser.map((item) => item.name).join(", ") +
                  " vào nhóm",
              },
              owner: req.user.id,
              seen: [req.user.id],
            },
          },
        },
        { upsert: true }
      );
      if (!addMemberGroup)
        return res
          .status(400)
          .json({ message: "Không tìm thấy nhóm chat", success: false });
      res.status(200).json({ message: "Thành công", success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Lỗi không xác định", success: false });
    }
  });
  return router;
};

module.exports = chatRouter;
