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
          if (err)
            socket.emit("error", {
              message: "Xác thực thất bại",
              status: 401,
              success: false,
            });
          else {
            io.users.push({ ...data, socketId: socket.id });

            socket.emit("success", {
              message: "Xác thực thành công",
              status: 200,
              success: true,
            });
            if (data.credit > 300 || data.isAdmin == true)
              socket.join("important");
            addUser(data.id);
          }
        }
      );
    });
    socket.on("disconnect", () => {
      const findUserDisconnect = io.users.find((item) => {
        return item.socketId === socket.id;
      });

      if (typeof findUserDisconnect !== "undefined") {
        listOnline.pullUserOffline(findUserDisconnect.id);
        io.to("important").emit("ononlines", listOnline.getUsers(1, -1).list);
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
