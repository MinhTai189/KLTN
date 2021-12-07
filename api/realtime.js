const socketio = require("socket.io");
const JWT = require("jsonwebtoken");
const user = require("./models/user");
const uuid = require("uuid");

module.exports.listen = function socket(server) {
  const io = socketio(server);
  io.users = [];
  io.on("connection", (socket) => {
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
          }
        }
      );
    });
    socket.on("disconnect", () => {
      io.users = io.users.filter((user) => user.socketId !== socket.id);
      console.log(socket.id + " disconnected");
      console.log(io.users);
    });
  });

  io.notifyToUser = async (userId, data) => {
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
