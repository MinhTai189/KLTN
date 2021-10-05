const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const schoolDataRouter = require("./routes/school-data");
const uploadRouter = require("./routes/upload");
const motelRouter = require("./routes/motel");
const roomRouter = require("./routes/room");
const rateRouter = require("./routes/rate");
const favoriteRouter = require("./routes/favorite");
const fileUpload = require("express-fileupload");
const Mongoose = require("mongoose");

const corsOpts = {
    origin: "*",

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: [
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    ],
};

const connectDB = async() => {
    try {
        await Mongoose.connect(
            `mongodb+srv://${process.env.MONGO_CONNECT_USERNAME}:${process.env.MONGO_CONNECT_PASSWORD}@kltn.v3vrk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
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

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

app.use("/api/", authRouter);
app.use("/api/", schoolDataRouter);
app.use("/api/", userRouter);
app.use("/api/", uploadRouter);
app.use("/api/motels", motelRouter);
app.use("/api/motels/rooms", roomRouter);
app.use("/api/motels/rates", rateRouter);
app.use("/api/users/favorites", favoriteRouter);