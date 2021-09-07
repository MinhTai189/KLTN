const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const schoolDataRouter = require("./routes/school-data");
const Mongoose = require("mongoose");

const corsOpts = {
    origin: "*",

    methods: ["GET", "POST"],

    allowedHeaders: [
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    ],
};

const connectDB = async() => {
    try {
        await Mongoose.connect(
            `mongodb+srv://${process.env.MONGO_CONNECT_USERNAME}:${process.env.MONGO_CONNECT_PASSWORD}@kltn.w0whk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

app.use("/api/", authRouter);
app.use("/api/", schoolDataRouter);
app.use("/api/", userRouter);