const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const http = require("http").createServer(app);
const socketio = require("./realtime").listen(http);

const authRouter = require("./routes/auth")(socketio);
const userRouter = require("./routes/user")(socketio);
const schoolDataRouter = require("./routes/school-data");
const uploadRouter = require("./routes/upload");
const motelRouter = require("./routes/motel")(socketio);
const roomRouter = require("./routes/room")(socketio);
const rateRouter = require("./routes/rate")(socketio);
const postRouter = require("./routes/post")(socketio);
const favoriteRouter = require("./routes/favorite")(socketio);
const commentRouter = require("./routes/comment")(socketio);
const approveRouter = require("./routes/approve")(socketio);
const feedBackRouter = require("./routes/feedBack")(socketio);
const notifyRouter = require("./routes/notify")(socketio);

const subjectRouter = require("./routes/subject");
const fileUpload = require("express-fileupload");
const Mongoose = require("mongoose");

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

  allowedHeaders: [
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'X-CSRF-TOKEN",
  ],
};

const connectDB = async () => {
  try {
    Mongoose.connect(
      `mongodb+srv://${process.env.MONGO_CONNECT_USERNAME}:${process.env.MONGO_CONNECT_PASSWORD}@kltn.v3vrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        //  useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //  useFindAndModify: false,
      }
    );
    console.log("db ok");
  } catch (error) {
    console.log(error);
  }
};
connectDB();
app.use(express.json());
app.use(cors(corsOpts));
app.use(fileUpload());
const PORT = process.env.PORT;

http.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

app.use("/api/", authRouter);
app.use("/api/", schoolDataRouter);
app.use("/api/", userRouter);
app.use("/api/", uploadRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/feedbacks", feedBackRouter);
app.use("/api/approves", approveRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users/favorites", favoriteRouter);
app.use("/api/motels/room", roomRouter);
app.use("/api/motels/rates", rateRouter);
app.use("/api/motels", motelRouter);
app.use("/api/notify", notifyRouter);

// const user = require("./models/user");
// const y = async () => {
//   const ObjectId = Mongoose.Types.ObjectId;
//   const j = await user.findByIdAndUpdate(
//     new ObjectId("6197931d159d728637346916"),
//     { $set: { id: new ObjectId("616b8678dd1e8090c8c17259") } }
//   );
//   console.log(j);

//   console.log("ok");
// };
// y();
