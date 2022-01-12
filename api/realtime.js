const socketio = require("socket.io");
const JWT = require("jsonwebtoken");
const user = require("./models/user");
const uuid = require("uuid");
const listOnline = require("./online");
const access = require("./models/access");
const motel = require("./models/motel");
const unapprovedMotel = require("./models/unapproved-motel");
const post = require("./models/post");
const userUpdateMotel = require("./models/user-update-motel");
const report = require("./models/report");
const comment = require("./models/comment");
const groupChat = require("./models/groupChat");
const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
function linkify(text) {
  var urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.match(urlRegex);
}

module.exports.listen = function socket(server) {
  const io = socketio(server);
  io.users = [];
  io.on("connection", (socket) => {
    plusQuantityAccess();
    console.log(socket.id + " connected");
    socket.on("auth", (msg) => {
      console.log(msg);
      JWT.verify(
        msg.accessToken,
        process.env.accessToken,
        async (err, data) => {
          if (err) {
            socket.emit("error", {
              message: "Xác thực thất bại",
              status: 401,
              success: false,
            });
          } else {
            io.users.push({ ...data, socketId: socket.id });
            socket.emit("success", {
              message: "Xác thực thành công",
              status: 200,
              success: true,
            });
            groupChat
              .find({ members: data.id })
              .select("_id members")
              .then((res) => {
                if (res)
                  res.forEach((item) => {
                    //socket.join(item._id.toString() + "_global");
                    io.to(item._id.toString()).emit("ononlines-chat", {
                      list: listOnline.getUsers(1, -1).list.filter((user) => {
                        return item.members.some(
                          (member) =>
                            JSON.stringify(member) === JSON.stringify(user._id)
                        );
                      }),
                      groupId: item._id.toString(),
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
              });
            if (data.credit > 300 || data.isAdmin == true)
              socket.join("important");
            addUser(data.id);
          }
        }
      );
    });
    socket.on("subscribes", () => {
      const findUser = io.users.find((item) => {
        return item.socketId === socket.id;
      });
      if (!findUser) return;
      groupChat
        .find({ members: findUser.id })
        .select("_id members")
        .then((res) => {
          if (res)
            res.forEach((group) => {
              socket.join(group._id.toString() + "_global");
            });
        });
    });
    socket.on("unsubscribes", () => {
      const allRoom = io.sockets.adapter.rooms;
      allRoom.forEach((value, key, map) => {
        if (key === socket.id) {
        } else if (key.includes("_global")) socket.leave(key);
      });
    });
    socket.on("subscribe-group", (id) => {
      if (id) socket.join(id.toString());
    });
    socket.on("unsubscribe-group", (id) => {
      if (id) socket.leave(id.toString());
    });
    socket.on("disconnect", () => {
      const findUserDisconnect = io.users.find((item) => {
        return item.socketId === socket.id;
      });

      if (typeof findUserDisconnect !== "undefined") {
        listOnline.pullUserOffline(findUserDisconnect.id);
        io.to("important").emit("ononlines", listOnline.getUsers(1, -1).list);
        groupChat
          .find({ members: findUserDisconnect.id })
          .select("_id members")
          .then((res) => {
            res.forEach((group) => {
              io.in(group._id.toString()).emit("ononlines-chat", {
                list: listOnline.getUsers(1, -1).list.filter((user) => {
                  return group.members.some(
                    (member) =>
                      JSON.stringify(member) === JSON.stringify(user._id)
                  );
                }),
                groupId: group._id.toString(),
              });
            });
          });
      }
      io.users = io.users.filter((user) => user.socketId !== socket.id);
      console.log(socket.id + " disconnected");
    });
  });
  const plusQuantityAccess = async () => {
    const currDate = new Date();

    const plusCurrentMonth = await access.findOneAndUpdate(
      { year: currDate.getFullYear(), month: currDate.getMonth() + 1 },
      { $inc: { quantity: 1 } }
    );
    if (!plusCurrentMonth) {
      const newMonth = new access({
        year: currDate.getFullYear(),
        month: currDate.getMonth() + 1,
        quantity: 1,
      });
      await newMonth.save();
    }

    io.sendDashboardStatisticals("access");
  };

  const addUser = async (id) => {
    const getUser = await user
      .findById(id)
      .select(
        "-notify -refreshToken -username -done -email -unsignedName -password -favorite -deleted -province -district"
      );

    let addUser = {
      ...getUser._doc,
      avatarUrl: getUser.avatarUrl.url,
    };
    listOnline.addUserOnline(addUser);

    io.to("important").emit("ononlines", listOnline.getUsers(1, -1).list);
  };
  io.sendTodropMessage = (messageId, groupId, userId) => {
    const findSocket = io.users.find(
      (user) => JSON.stringify(user.id) === JSON.stringify(userId)
    );
    if (findSocket) {
      const socket = io.sockets.sockets.get(findSocket.socketId);
      if (socket) {
        socket
          .to(groupId.toString())
          .emit("drop-message-" + groupId.toString(), {
            messageId: messageId,
          });
      }
    }
  };
  io.logout = (userId) => {
    io.users = io.users.filter(
      (user) => JSON.stringify(userId) === JSON.stringify(user.id)
    );
    listOnline.pullUserOffline(userId);
    io.to("important").emit("ononlines", listOnline.getUsers(1, -1).list);
    groupChat
      .find({ members: userId })
      .select("_id members")
      .then((res) => {
        res.forEach((group) => {
          io.in(group._id.toString()).emit("ononlines-chat", {
            list: listOnline.getUsers(1, -1).list.filter((user) => {
              return group.members.some(
                (member) => JSON.stringify(member) === JSON.stringify(user._id)
              );
            }),
            groupId: group._id.toString(),
          });
        });
      });
  };
  io.notifyNewMessage = (newMessage, members) => {
    const socketsToSend = [
      ...io.users.filter((user) =>
        members.some(
          (member) => JSON.stringify(member) === JSON.stringify(user.id)
        )
      ),
    ];
    groupChat
      .find({
        $or: members.map((member) => {
          return { members: member };
        }),
      })
      .then((res) => {
        if (res) {
          const findGroup = res.find(
            (group) =>
              JSON.stringify(group._id) === JSON.stringify(newMessage.groupId)
          );
          let name = findGroup.name;
          if (findGroup.type === "private")
            name = newMessage.message.owner.name;
          socketsToSend.forEach((socket) => {
            io.to(socket.socketId).emit("notify-new-messages", {
              group: {
                ...findGroup._doc,
                name: name,
                messages: undefined,
                members: undefined,
              },
              message: newMessage.message,
              numMessages: res
                .filter((group) =>
                  group.members.some(
                    (member) =>
                      JSON.stringify(socket.id) === JSON.stringify(member)
                  )
                )
                .reduce((sum, group) => {
                  return (sum += group.messages.filter((message) => {
                    return !message.seen.some(
                      (see) => JSON.stringify(see) === JSON.stringify(socket.id)
                    );
                  }).length);
                }, 0),
            });
          });
        }
      });
  };
  io.sendMessage = (groupId, newMessage, members) => {
    let message;

    if (newMessage.type === "gif")
      message = {
        groupId: groupId.toString(),
        message: {
          ...newMessage._doc,
          status: false,
          owner: {
            ...newMessage.owner._doc,
            avatarUrl: newMessage.owner.avatarUrl.url,
            totalLikes: newMessage.owner.likes.length,
          },
          seen: newMessage.seen.map((userseen) => {
            return {
              ...userseen._doc,
              avatarUrl: userseen.avatarUrl.url,
              totalLikes: userseen.likes.length,
            };
          }),
        },
      };
    else if (newMessage.type === "image")
      message = {
        groupId: groupId.toString(),
        message: {
          ...newMessage._doc,
          urlImages: newMessage.urlImages.map((image) => image.url),
          status: false,
          owner: {
            ...newMessage.owner._doc,
            avatarUrl: newMessage.owner.avatarUrl.url,
            totalLikes: newMessage.owner.likes.length,
          },
          seen: newMessage.seen.map((userseen) => {
            return {
              ...userseen._doc,
              avatarUrl: userseen.avatarUrl.url,
              totalLikes: userseen.likes.length,
            };
          }),
        },
      };
    else
      message = {
        groupId: groupId.toString(),
        message: {
          ...newMessage._doc,
          status: false,
          owner: {
            ...newMessage.owner._doc,
            avatarUrl: newMessage.owner.avatarUrl.url,
            totalLikes: newMessage.owner.likes.length,
          },
          seen: newMessage.seen.map((userseen) => {
            return {
              ...userseen._doc,
              avatarUrl: userseen.avatarUrl.url,
              totalLikes: userseen.likes.length,
            };
          }),
        },
      };
    const findSocket = io.users.find(
      (user) => JSON.stringify(user.id) === JSON.stringify(newMessage.owner._id)
    );
    if (findSocket) {
      const socket = io.sockets.sockets.get(findSocket.socketId);
      if (socket) {
        socket
          .to(groupId.toString() + "_global")
          .emit("new-message-all-group", message);

        socket
          .to(groupId.toString())
          .emit(`new-message-${groupId}`, message.message);
      }
      io.notifyNewMessage(message, members);
    }
  };

  io.getListOnlineByGroupId = (groupId) => {
    return getListOnlineByGroupId(groupId);
  };
  getListOnlineByGroupId = (groupId) => {
    const clients = io.sockets.adapter.rooms.get(groupId.toString());

    if (!clients) return [];

    const listIdClient = io.users.filter((user) => {
      return Array.from(clients).some((c) => {
        return c === user.socketId;
      });
    });
    return listOnline.getUsers(1, -1).list.filter((user) => {
      return listIdClient.some(
        (member) => JSON.stringify(member.id) === JSON.stringify(user._id)
      );
    });
  };
  io.membersOnChangeLeaveGroup = async (groupId, group, userId) => {
    io.in(groupId.toString()).emit("ononlines-chat", {
      list: listOnline.getUsers(1, -1).list.filter((user) => {
        return group.members.some(
          (member) => JSON.stringify(member._id) === JSON.stringify(user._id)
        );
      }),
      groupId: group._id.toString(),
    });
    const findSockets = io.users.filter(
      (user) => JSON.stringify(user.id) === JSON.stringify(userId)
    );
    findSockets.forEach((findSocket) =>
      io.to(findSocket.socketId).emit("quit-group", groupId)
    );
  };
  io.membersOnChangeAddToGroup = async (groupId, group, userId) => {
    io.in(groupId.toString()).emit("ononlines-chat", {
      list: listOnline.getUsers(1, -1).list.filter((user) => {
        return group.members.some(
          (member) => JSON.stringify(member) === JSON.stringify(user._id)
        );
      }),
      groupId: group._id.toString(),
    });
    // const findSocket = io.users.find(
    //   (user) => JSON.stringify(user.id) === JSON.stringify(userId)
    // );

    // if (!findSocket) return;

    // if (findSocket) {
    //   io.sockets.sockets.get(findSocket.socketId).join(groupId.toString());
    //   let name = group.name;
    //   if (group.type === "private") {
    //     if (
    //       group.members.find(
    //         (mem) => JSON.stringify(mem._id) !== JSON.stringify(userId)
    //       )
    //     )
    //       name = group.members.find(
    //         (mem) => JSON.stringify(mem._id) !== JSON.stringify(userId)
    //       ).name;
    //   }
    //   io.to(findSocket.socketId).emit("new-group", {
    //     ...group._doc,
    //     name: name,
    //     members: group.members.map((member) => {
    //       return {
    //         ...member._doc,
    //         avatarUrl: member.avatarUrl.url,
    //         totalLikes: member.likes.length,
    //       };
    //     }),
    //     totalMembers: group.members.length,
    //     lastMessage: group.messages[group.messages.length - 1],
    //     messages: undefined,
    //     unseen: group.messages.filter((message) => {
    //       return !message.seen.some(
    //         (m) => JSON.stringify(m) === JSON.stringify(userId)
    //       );
    //     }).length,
    //     ononlines: io.getListOnlineByGroupId(group._id),
    //   });
    // }
  };

  io.notifyToUser = async (userId, data) => {
    console.log(data.message);
    const newId = uuid.v4();

    const findUser = await user.findById(userId);
    let findOwner;
    let message = data.message;

    if (data.ownerId) {
      findOwner = await user.findById(data.ownerId).select("name");
      message = `${findOwner.name}${data.message}`;
    }
    const notify = {
      imageUrl: data.imageUrl,
      message: message,
      url: data.url,
      read: false,
      _id: newId,
      createdAt: new Date(),
    };
    findUser.notify.push(notify);
    if (findUser.notify.length > 30) findUser.notify.shift();
    findUser.save();
    const userToSend = io.users.find(
      (user) => JSON.stringify(user.id) === JSON.stringify(userId)
    );
    if (!userToSend) return;
    io.to(userToSend.socketId).emit("notify", notify);
  };

  io.notifyToAllUser = async (data) => {
    const newId = uuid.v4();
    if (data.ownerId) {
      findOwner = await user.findById(data.ownerId).select("name");
      data.message = `${findOwner.name}${data.message}`;
    }
    const notify = { ...data, read: false, _id: newId, createdAt: new Date() };
    await user.updateMany({ deleted: false }, { $push: { notify: notify } });
    await user.updateMany(
      { deleted: false, notify: { $size: { $gt: 30 } } },
      { $pop: { notify: -1 } }
    );
    io.emit("notify", { ...notify });
  };

  // io.joinRoomIfOnonline = async (userId, groupId) => {
  //   const getUserAuth = io.users.find((item) => {
  //     return JSON.stringify(item.id) === JSON.stringify(userId);
  //   });
  //   if (!getUserAuth) {
  //     console.log("Chua xac thuc");
  //     return;
  //   } else {
  //     io.sockets.connected[getUserAuth.socketId].join(groupId);
  //   }
  // };
  io.auth = (accessToken) => {
    JWT.verify(accessToken, process.env.accessToken, async (err, data) => {
      if (err) {
      } else {
        io.users.push({ ...data, socketId: socket.id });
      }
    });
  };
  io.dashboardData = {
    recents: {
      activities: undefined,
      motels: undefined,
    },
    statisticals: {
      account: undefined,
      motel: undefined,
      approval: undefined,
      access: undefined,
      post: undefined,
    },
  };
  io.sendDashboardRecent = async (type) => {
    if (type === "motels" || io.dashboardData.recents.motels == undefined) {
      const motels = await motel
        .find({})
        .select("-editor -rate")
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      const waitingMotels = await unapprovedMotel
        .find({})
        .populate(
          "owner",
          "avatarUrl name isAdmin _id credit email posts motels rank school likes"
        );
      let recentMotels = [];
      for (let i = 0; i < motels.length; i++) {
        recentMotels.push({
          ...motels[i]._doc,
          thumbnail: motels[i].thumbnail.url,
          images: motels[i].images.map((item) => item.url),
          owner: {
            ...motels[i].owner._doc,
            avatarUrl: motels[i].owner.avatarUrl.url,
            totalLikes: motels[i].owner.likes.length,
          },
          type: "Đang hoạt động",
        });
      }
      for (let i = 0; i < waitingMotels.length; i++) {
        recentMotels.push({
          ...waitingMotels[i]._doc,
          thumbnail: waitingMotels[i].thumbnail.url,
          images: waitingMotels[i].images.map((item) => item.url),
          owner: {
            ...waitingMotels[i].owner._doc,
            avatarUrl: waitingMotels[i].owner.avatarUrl.url,
            totalLikes: waitingMotels[i].owner.likes.length,
          },
          type: "Đang chờ duyệt",
        });
      }
      io.dashboardData.recents.motels = [...recentMotels];
      if (type === "motels")
        io.to("important").emit(
          "motels",
          io.dashboardData.recents.motels.sort(
            (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
          )
        );
    }
    if (
      type === "activities" ||
      io.dashboardData.recents.activities == undefined
    ) {
      const users = await user
        .find({})
        .select(
          "-notify -refreshToken -username -email -unsignedName -password -favorite -deleted "
        );
      let recentActivities = [];
      for (let i = 0; i < users.length; i++) {
        const done = users[i].done.map((item) => {
          let title = item.title;

          title =
            item.title[0].toLowerCase() + title.substring(1, title.length);

          return { ...item._doc, title: users[i].name + " " + title };
        });
        for (let j = 0; j < done.length; j++)
          recentActivities = [
            ...recentActivities,
            {
              ...done[j],
              owner: {
                ...users[i]._doc,
                avatarUrl: users[i].avatarUrl.url,
                done: undefined,
                totalLikes: users[i].likes.length,
              },
            },
          ];
      }
      io.dashboardData.recents.activities = [...recentActivities];
      if (type === "activities")
        io.to("important").emit(
          "activities",
          io.dashboardData.recents.activities.sort(
            (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
          )
        );
    }
    // io.to("important").emit("recents", {
    //   activities: io.dashboardData.recents.activities.sort(
    //     (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
    //   ),
    //   motels: io.dashboardData.recents.motels.sort(
    //     (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
    //   ),
    // });
  };
  io.sendDashboardStatisticals = async (type) => {
    if (
      type === "accounts" ||
      io.dashboardData.statisticals.account == undefined
    ) {
      io.dashboardData.statisticals.account = await user.count({
        deleted: false,
      });
    }
    if (type === "motels" || io.dashboardData.statisticals.motel == undefined) {
      io.dashboardData.statisticals.motel = await motel.count({});
    }
    if (
      type === "approvals" ||
      io.dashboardData.statisticals.approval == undefined
    ) {
      const counts = await Promise.all([
        unapprovedMotel.count().exec(),
        userUpdateMotel.count().exec(),
        post.count({ valid: false }).exec(),
        post.find({ valid: true }).select("_id"),
        report.find(),
        comment.find().select("_id"),
        motel.find().select("_id rate"),
      ]);
      const reports = counts[4];
      const quantityMotel = counts[6];
      const quantityPost = counts[3];
      const comments = counts[5];
      let countReport = 0;
      let countRate = 0;
      for (let i = 0; i < quantityMotel.length; i++) {
        countRate += quantityMotel[i].rate.filter(
          (item) => item.valid == false
        ).length;
      }
      for (let i = 0; i < reports.length; i++) {
        let getData;
        if (reports[i].type === "rate")
          getData = quantityMotel.find((item) => {
            return (
              item.rate.some(
                (r) => JSON.stringify(r._id) === JSON.stringify(reports[i].id2)
              ) && JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
            );
          });
        else if (reports[i].type === "post")
          getData = quantityPost.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
          );
        else if (reports[i].type === "comment")
          getData = comments.find(
            (item) =>
              JSON.stringify(item._id) === JSON.stringify(reports[i].id1)
          );

        if (getData) countReport = countReport + 1;
      }
      io.dashboardData.statisticals.approval =
        countReport + counts[0] + counts[1] + counts[2] + countRate;
    }
    if (
      type === "access" ||
      io.dashboardData.statisticals.access == undefined
    ) {
      const currDate = new Date();
      const quantityAccessingCurrMonth = await access
        .findOne({
          year: currDate.getFullYear(),
          month: currDate.getMonth() + 1,
        })
        .select("quantity");
      io.dashboardData.statisticals.access =
        quantityAccessingCurrMonth.quantity;
    }
    if (type === "posts" || io.dashboardData.statisticals.post == undefined) {
      io.dashboardData.statisticals.post = await post.count({ valid: true });
    }
    io.to("important").emit("statisticals", {
      ...io.dashboardData.statisticals,
    });
  };
  return io;
};
