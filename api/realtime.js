const socketio = require("socket.io");
const JWT = require("jsonwebtoken");
const user = require("./models/user");
const uuid = require("uuid");
const listOnline = require("./online");
const access = require("./models/access");
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
};

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
};

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
            addUser(data.id);
            socket.emit("success", {
              message: "Xác thực thành công",
              status: 200,
              success: true,
            });
          }
        }
      );
    });
    socket.on("disconnect", () => {
      const findUserDisconnect = io.users.find((item) => {
        return item.socketId === socket.id;
      });
      console.log(findUserDisconnect);
      if (typeof findUserDisconnect !== "undefined")
        listOnline.pullUserOffline(findUserDisconnect.id);
      io.users = io.users.filter((user) => user.socketId !== socket.id);
      console.log(socket.id + " disconnected");
    });
  });

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

  return io;
};
