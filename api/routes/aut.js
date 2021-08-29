const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const user = require("../models/user");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/reset-password/:key", async (req, res) => {
    const token = req.params.key; // Lấy key
    const { newPassword } = req.body; //Lấy mật khẩu mới
    let data;
    JWT.verify(token, process.env.forgotPasswordToken, (err, dataUser) => {
        //Xác thực key
        if (err) {
            console.log(err);
            return res
                .status(500)
                .json({ success: false, message: "Key isn't false" });
        }
        data = dataUser;
    });
    // hash mật khẩu mới
    const newPasswordHashed = await argon2.hash(newPassword);
    try {
        //Cập nhật mật khẩu
        await user.findByIdAndUpdate(data.user, {
            password: newPasswordHashed,
        });
        res.status(200).json({ success: true, message: "password has been reset" });
    } catch (err) {
        return res.status(404);
    }
});
router.get("/reset-password/:key", (req, res) => {
    //Route kiểm tra key
    const token = req.params.key;
    JWT.verify(token, process.env.forgotPasswordToken, async (err, data) => {
        if (err) {
            //Nếu không đúng

            return res
                .status(500)
                .json({ success: false, message: "Key isn't false" });
        }
        const userLogin = await user.findById(data.user);
        if (userLogin)
            //nếu đúng
            return res.status(200).json({ success: true, message: "Key is true" });
    });
});
router.post("/forgot-password", async (req, res) => {
    //Route quên mật khẩu, nhận mail, xác thực
    const { email } = req.body; //lấy email
    const User = await user.findOne({ email: email });

    if (!User) {
        return res
            .status(401)
            .json({ success: false, message: "email isn't exist" });
    }
    //Cung cấp key (30 phút)
    const forgotPasswordToken = JWT.sign({ user: User._id },
        process.env.forgotPasswordToken, { expiresIn: "30m" }
    );
    const transporter = nodemailer.createTransport({
        // config mail
        service: "Gmail",
        auth: {
            user: process.env.configmailuser,
            pass: process.env.configmailpass,
        },
    });
    const mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: "Tìm nhà trọ TGU",
        to: User.email,
        subject: "Forgot Password",
        text: "",
        html: `<div style="background-color:#c0392b;height: 500px;color: white;display:flex;" >
    <div style="margin:auto">
      <div style="
      width:5%;
      display: table-cell;
      vertical-align:middle;
      text-align: center;
      height: 80px;
      font-size: 20px;
      font-weight: bold;
      background: #27ae60;
      border-radius: 10px 10px 0 0;">Lấy lại mật khẩu
    </div>
      <div style="padding: 30px;
      color: #666666;
      height: auto;
      margin:auto;
      font-size: 20px;
      box-sizing: border-box;
      background: white;
      border-radius: 0px 0px 10px 10px;">
        Gửi ${User.name}
        <br/>
        <br/>
        Chúng tôi vừa nhận được yêu cầu hợp lệ của bạn về việc tạo lại mật khẩu mới.
        <br/>
        <br/>
        Để tạo lại mật khẩu, vui lòng click vào liên kết bên dưới
        <br/>
        <br/>
        <b style="color: red">Lưu ý: không chia sẻ liên kết này với bất kỳ ai!</b>
        <a style="display: inline-block;text-decoration: none;
        height: 40px;
        line-height: 40px;
        border: none;
        border-radius: 5px;
        padding: 5px 15px;
        background: #b5c0fd;
        margin-right: 10px;
        border:2px #00189e solid;
        color: #00189e;
        font-size: 18px;" href="${process.env.ORIGIN}/reset-password/${forgotPasswordToken}"> Lấy lại mật khẩu
      </a>
      </div>
      </div></div>`,
    };
    transporter.sendMail(mainOptions, function (err, info) {
        //tiến hành gửi mail
        if (err) {
            return res
                .status(400)
                .json({ success: false, message: "khong the gui mail" });
        } else {
            return res.status(200).json({ success: true, message: "da gui mail" });
        }
    });
});

router.post("/register", async (req, res) => {
    const {
        username,
        password,
        name,
        avatar,
        email,
        districts,
        province,
        school,
    } = req.body;
    const checkUser = await user.findOne({ username });
    if (checkUser)
        return res
            .status(400)
            .json({ success: false, message: "username is exist" });
    const checkEmail = await user.findOne({ email });
    if (checkEmail)
        return res
            .status(400)
            .json({ success: false, message: "email already used" });
    // Good
    try {
        const hashedPassword = await argon2.hash(password);
        const newUser = new user({
            username,
            password: hashedPassword,
            name,
            avatar,
            credit: undefined,
            favorite: undefined,
            isAdmin: undefined,
            email,
            districts,
            province,
            school,
        });

        await newUser.save();
        res.status(200).json({ success: true, message: "dang ky thanh cong" });
    } catch (err) {
        res.status(401).json({ success: false, message: "khong thanh cong", err });
    }
});

//đăng nhập
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const checkUser = await user.findOne({ username });

    if (checkUser == null)
        return res.json({ success: false, message: "username isn't exist" });

    const pass = await argon2.verify(checkUser.password, password);
    if (!pass) return res.json({ success: false, message: "password is false" });
    //good
    try {
        const accessToken = JWT.sign({ user: checkUser._id },
            process.env.accessToken, { expiresIn: "2d" }
        );
        const newData = await user.findById(checkUser._id).select("-password");
        if (accessToken)
            res.status(200).json({
                success: true,
                message: "thanh cong",
                accessToken,
                data: newData,
            });
    } catch (error) {
        res.status(404).json({ error: "404 Error" });
    }
});

module.exports = router;