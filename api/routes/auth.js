const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const user = require("../models/user");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.SERVICE_CLIENT_ID);
const removeVietnameseTones = require("../methods/removeVietnameseTones");
const axios = require("axios").default;
let refreshTokens = [];

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
        await user.findByIdAndUpdate(data.id, {
            password: newPasswordHashed,
        });
        res.status(200).json({ success: true, message: "password has been reset" });
    } catch (err) {
        return res.status(404);
    }
});

router.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;

    const check = refreshTokens.find((x) => x.refreshToken === refreshToken);

    if (!check)
        return res
            .status(403)
            .json({ success: false, message: "refreshToken is false" });

    JWT.verify(refreshToken, check.key, (err, data) => {
        if (err)
            return res
                .status(400)
                .json({ success: false, message: "refreshToken is false" });

        const accessToken = JWT.sign({ id: data.id, isAdmin: data.isAdmin },
            process.env.accessToken, {
            expiresIn: "1m",
        }
        );

        const key = uuid.v4();
        const newRefreshToken = JWT.sign({ id: data.id, isAdmin: data.isAdmin },
            key
        );

        refreshTokens = refreshTokens.filter((item) => {
            return item.key !== check.key;
        });
        refreshTokens.push({ key, refreshToken: newRefreshToken });

        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
            },
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
    const forgotPasswordToken = JWT.sign({ id: User._id },
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
        const unsignedName = removeVietnameseTones(name);
        const newUser = new user({
            username,
            password: await argon2.hash(password),
            name,
            unsignedName,
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
    const { username, password } = req.body;
    const { authorization } = req.headers;
    let userID = undefined;
    let checkUser;
    console.log(authorization);

    try {
        if (Boolean(username) && Boolean(password)) {
            checkUser = await user.findOne({ username }).select("-unsignedName");

            if (checkUser == null)
                return res
                    .status(404)
                    .json({ success: false, message: "username isn't exist" });

            const pass = await argon2.verify(checkUser.password, password);
            if (!pass)
                return res
                    .status(404)
                    .json({ success: false, message: "password is false" });
        } else {
            JWT.verify(authorization, process.env.accessToken, async (err, data) => {
                if (err) return res.status(401).json({ success: false, message: "Invalid token" });
                // trong đây, nếu hết hạn trả về mã 401, hình như mày phải dịch JWT ra, nó có chứa expire
                userID = data.id;
            });
        }

        if (userID) checkUser = await user.findById(userID).select("-unsignedName");

        const newAccessToken = JWT.sign({ id: checkUser._id, isAdmin: checkUser.isAdmin },
            process.env.accessToken, { expiresIn: "10m" }
        );

        const key = uuid.v4();
        const newRefreshToken = JWT.sign({ id: checkUser._id, isAdmin: checkUser.isAdmin },
            key
        );

        refreshTokens.push({ key, refreshToken: newRefreshToken });

        res.status(200).json({
            success: true,
            message: "thanh cong",
            data: {
                ...checkUser._doc,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            error: error,
        });
    }
});
router.post("/register-facebook", async (req, res) => {
    const { accessToken, userID, email, district, school, province } = req.body;
    const url = `https://graph.facebook.com/v4.0/${userID}/?fields=id,email,name,picture
    &access_token=${accessToken}`;
    const data = await axios.get(url);
    const { id, name, picture } = data.data;

    const checkUser = await user.findOne({
        $or: [{ username: id }, {
            email: email
        }]
    });
    if (checkUser)
        return res
            .status(401)
            .json({ message: "facebook userID or email was used", success: false });

    const password = id + process.env.PASSWORD_SECRET_FACEBOOK;
    const unsignedName = removeVietnameseTones(name);
    const newUser = new user({
        username: id,
        password: await argon2.hash(password),
        name,
        unsignedName,
        avatarUrl: picture.data.url,
        credit: undefined,
        favorite: undefined,
        isAdmin: undefined,
        email,
        district,
        province,
        school,
    });
    await newUser.save();

    const newAccessToken = JWT.sign({ id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.accessToken, { expiresIn: "10m" }
    );

    res.status(200).json({
        success: true,
        message: " dang ky thanh cong",
        data: {
            accessToken: newAccessToken
        }
    });
});

router.post("/login-facebook", async (req, res) => {
    const { accessToken, userID } = req.body;

    const url = `https://graph.facebook.com/v4.0/${userID}/?fields=id,email,name,picture
    &access_token=${accessToken}`;
    const data = await axios.get(url);

    const { id } = data.data;
    const checkUser = await user.findOne({ username: id });
    if (!checkUser)
        return res.status(200).json({ message: "user not found", success: false });
    const password = id + process.env.PASSWORD_SECRET_FACEBOOK;
    const isMatch = await argon2.verify(checkUser.password, password);
    if (!isMatch)
        return res
            .status(400)
            .json({ message: "password id incorrect", success: false });

    //good
    const newAccessToken = JWT.sign({ id: checkUser._id, isAdmin: checkUser.isAdmin },
        process.env.accessToken, { expiresIn: "10m" }
    );

    res.status(200).json({
        success: true,
        message: "thanh cong",
        data: {
            accessToken: newAccessToken,
        },
    });
});
router.post("/register-google", async (req, res) => {
    const { tokenId, school, district, province } = req.body;

    const result = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.SERVICE_CLIENT_ID,
    });
    const userGmail = result.getPayload();

    if (!userGmail.email_verified)
        return res
            .status(400)
            .json({ success: false, message: "Email verification failed" });
    const checkUser = await user.findOne({
        $or: [{ username: userGmail.email }, { email: userGmail.email }],
    });
    if (checkUser)
        return res.status(401).json({ success: false, message: "email was used" });
    const password = userGmail.email + process.env.PASSWORD_SECRET_GOOGLE;
    const { email, picture, name } = userGmail;
    const unsignedName = removeVietnameseTones(name);
    const newUser = new user({
        username: email,
        password: await argon2.hash(password),
        name,
        unsignedName,
        avatarUrl: picture,
        credit: undefined,
        favorite: undefined,
        isAdmin: undefined,
        email,
        district,
        province,
        school,
    });
    await newUser.save();
    const newAccessToken = JWT.sign({ id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.accessToken, { expiresIn: "10m" }
    );
    res.status(200).json({
        success: true,
        message: " dang ky thanh cong",
        data: {
            accessToken: newAccessToken
        }
    });
});
router.post("/login-google", async (req, res) => {
    const { tokenId } = req.body;
    console.log(tokenId);
    const result = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.SERVICE_CLIENT_ID,
    });
    const userGmail = result.getPayload();
    const checkUser = await user.findOne({ email: userGmail.email });

    if (!userGmail.email_verified)
        return res
            .status(400)
            .json({ success: false, message: "Email verification failed" });

    if (!checkUser)
        return res.status(200).json({ success: false, message: "user not found" });

    if (!tokenId) {
        const password = userGmail.email + process.env.PASSWORD_SECRET_GOOGLE;
        const isMatch = await argon2.verify(checkUser.password, password);
        if (!isMatch)
            return res
                .status(400)
                .json({ success: false, message: "password is incorrect" });
    }

    const newAccessToken = JWT.sign({ id: checkUser._id, isAdmin: checkUser.isAdmin },
        process.env.accessToken, { expiresIn: "10m" }
    );

    res.status(200).json({
        success: true,
        message: "thanh cong",
        data: {
            accessToken: newAccessToken,
        },
    });
});
module.exports = router;