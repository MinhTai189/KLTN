const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const user = require("../models/user");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");

let refeshTokens = [];

router.post("/reset-password", async (req, res) => {
    const { password, token } = req.body;
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
    const newPasswordHashed = await argon2.hash(password);
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

// const checkToken = (token) => {
//     for (let i = 0; i < refeshTokens.length; i++)
//         if (refeshTokens[i].refeshToken == token) return refeshTokens[i];
//     return undefined;
// };
router.post("/refesh-token", (req, res) => {
    const { refeshToken } = req.body;
    console.log(refeshTokens)
    const check = refeshTokens.find(x => x.refeshToken === refeshToken);

    if (!check)
        return res.status(403).json({ success: false, message: "refeshToken is false" });

    JWT.verify(refeshToken, check.key, (err, data) => {
        if (err)
            return res
                .status(400)
                .json({ success: false, message: "refeshToken is false" });

        const accessToken = JWT.sign({ user: data.user }, process.env.accessToken, {
            expiresIn: "50m",
        });

        const key = uuid.v4();
        const newRefeshToken = JWT.sign({ user: data.user },
            key
        );

        refeshTokens = refeshTokens.filter((item) => {
            return item.key !== check.key;
        });
        refeshTokens.push({ key, refeshToken: newRefeshToken });

        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: {
                accessToken,
                refeshToken: newRefeshToken,
            }
        });
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
        process.env.forgotPasswordToken, { expiresIn: "10m" }
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
        font-size: 18px;" href="${process.env.ORIGIN}/auth/reset-password/${forgotPasswordToken}"> Lấy lại mật khẩu
      </a>
      </div>
      </div></div>`,
    };
    transporter.sendMail(mainOptions, function (err, info) {
        //tiến hành gửi mail
        if (err) {
            return res.status(400).json({ error: err });
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
        avatarUrl,
        email,
        district,
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
        const newUser = new user({
            username,
            password: await argon2.hash(password),
            name,
            avatarUrl,
            credit: undefined,
            favorite: undefined,
            isAdmin: undefined,
            email,
            district,
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
    const { username, password, accessToken } = req.body;
    let userID = undefined;
    let checkUser;

    try {
        if (accessToken) {

            JWT.verify(accessToken, process.env.accessToken, async (err, data) => {
                if (err) return;
                userID = data.user;


            });

        }
        else {
            checkUser = await user.findOne({ username });

            if (checkUser == null)
                return res
                    .status(404)
                    .json({ success: false, message: "username isn't exist" });

            const pass = await argon2.verify(checkUser.password, password);
            if (!pass)
                return res
                    .status(404)
                    .json({ success: false, message: "password is false" });
        }
        if (userID)
            checkUser = await user.findById(userID);

        const newAccessToken = JWT.sign({ user: checkUser._id },
            process.env.accessToken, { expiresIn: "50m" }
        );

        const key = uuid.v4();
        const newRefeshToken = JWT.sign({ user: checkUser._id },
            key
        );

        refeshTokens.push({ key, refeshToken: newRefeshToken });


        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: {
                ...checkUser._doc,
                accessToken: newAccessToken,
                refeshToken: newRefeshToken,
            },
        });
    } catch (error) {
        res.status(404).json({ error });
    }
});

module.exports = router;