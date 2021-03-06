const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const user = require("../models/user");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const schoolModel = require("../models/school");
const districtModel = require("../models/districts");
const provinceModel = require("../models/province");
const upload = require("../middleware/upload");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.SERVICE_CLIENT_ID);
const removeVietnameseTones = require("../utils/removeVietnameseTones");
const axios = require("axios").default;
const verifyToken = require("../middleware/verifyToken");
const groupChat = require("../models/groupChat");
const authRouter = (io) => {
  // router.get("/", async (req, res) => {
  //   const users = await user.find({ deleted: false });
  //   const newGroup = new groupChat({
  //     name: "Giao lưu, trao đổi, hỏi đáp",
  //     members: users.map((user) => user._id.toString()),
  //   });
  //   await newGroup.save();
  //   res.send("ok");
  // });

  router.patch("/change-password", verifyToken, async (req, res) => {
    const { oldPassword, password } = req.body;

    try {
      const foundUser = await user.findOne({ _id: req.user.id });

      if (!foundUser)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy tài khoản!" });

      const checkPass = await argon2.verify(foundUser.password, oldPassword);

      if (!checkPass)
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu cũ không chính xác!" });

      const hashedPassword = await argon2.hash(password);

      await user.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: hashedPassword,
        }
      );

      return res
        .status(200)
        .json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Đổi mật khẩu thất bại!" });
    }
  });

  router.post("/reset-password", async (req, res) => {
    const { password, token } = req.body;
    let data;
    JWT.verify(token, process.env.forgotPasswordToken, (err, dataUser) => {
      //Xác thực key
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Đường dẫn không chính xác" });
      }
      data = dataUser;
    });
    // hash mật khẩu mới
    const newPasswordHashed = await argon2.hash(password);
    try {
      //Cập nhật mật khẩu
      await user.findOneAndUpdate(
        { _id: data.id, deleted: false },
        {
          password: newPasswordHashed,
        }
      );
      res
        .status(200)
        .json({ success: true, message: "Mật khẩu đã được sửa đổi" });
    } catch (err) {
      return res.status(404);
    }
  });

  router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    const check = await user.findOne({
      refreshToken: refreshToken,
      deleted: false,
    });

    if (!check)
      return res
        .status(403)
        .json({ success: false, message: "refresh token không chính xác" });
    const accessToken = JWT.sign(
      { id: check._id, isAdmin: check.isAdmin, credit: check.credit },
      process.env.accessToken,
      {
        expiresIn: "10m",
      }
    );

    const key = uuid.v4();
    const newRefreshToken = JWT.sign(
      { id: check._id, isAdmin: check.isAdmin, credit: check.credit },
      key
    );

    check.refreshToken = newRefreshToken;
    await check.save();

    res.status(200).json({
      success: true,
      message: "refresh thành công",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  });

  router.post("/forgot-password", async (req, res) => {
    //Route quên mật khẩu, nhận mail, xác thực
    const { email } = req.body; //lấy email
    const User = await user.findOne({ email: email, deleted: false });

    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "Email chưa được đăng ký" });
    }
    if (User.username === User.email) {
      const password = User.email + process.env.PASSWORD_SECRET_GOOGLE;
      const isMatch = await argon2.verify(checkUser.password, password);
      if (isMatch)
        return res.status(400).json({
          success: false,
          message: "Email này không sử dụng mật khẩu",
        });
    }
    if (!isNaN(parseInt(User.username))) {
      const password = User.username + process.env.PASSWORD_SECRET_FACEBOOK;
      const isMatch = await argon2.verify(checkUser.password, password);
      if (isMatch)
        return res.status(400).json({
          success: false,
          message: "Email này không sử dụng mật khẩu",
        });
    }
    //Cung cấp key (10 phút)
    const forgotPasswordToken = JWT.sign(
      { id: User._id },
      process.env.forgotPasswordToken,
      { expiresIn: "10m" }
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
      from: "Nhà trọ Sinh viên",
      to: User.email,
      subject: "Quên mật khẩu",
      text: "",
      html: `<div
      style="
        width: 100%;
        max-width: 550px;
        margin: 0 auto;
        outline: 2px solid #ccc;
        padding-bottom: 4px;
      "
    >
      <div style="padding: 8px 4px; text-align: center">
        <img
          style="width: 45px; height: 45px"
          src="https://res.cloudinary.com/dpregsdt9/image/upload/v1641390438/logo_1_h8e2hu.png"
        />

        <h1
          style="
            font-size: 20px;
            color: #2196f3;
            font-weight: 600;
            text-transform: uppercase;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 4px 0;
          "
        >
          Quên mật khẩu
        </h1>
      </div>

      <div
        style="
          padding: 4px 12px 8px;
          font-size: 16px;
          border-top: 1px solid #ccc;
        "
      >
        <p style="margin: 8px 0">Chào ${User.name},</p>

        <p style="margin: 8px 0">
          Bạn đã thực hiện yêu cầu lấy lại mật khẩu của tài khoản đã liên kết
          với địa chỉ mail: ${email}
        </p>

        <p style="margin: 8px 0">
          Nếu như không phải yêu cầu đến từ phía của bạn. Hãy bỏ qua email này!
        </p>

        <p style="margin: 8px 0">
          Bấm vào nút "Lấy lại mật khẩu" bên dưới để thực hiện lấy lại mật khẩu:
        </p>

        <button
          style="
            background: none;
            outline: none;
            background: #2196f3;
            border: none;
            width: 130px;
            height: 40px;
            border-radius: 24px;
            box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.45);
            margin: 16px auto;
            display: block;
          "
        >
          <a
            style="
              color: #fff;
              text-decoration: none;
              font-size: 14px;
              display: block;
              width: 100%;
              height: 100%;
              line-height: 40px;
            "
            href="${process.env.ORIGIN}/auth/reset-password/${forgotPasswordToken}"
            >Lấy lại mật khẩu</a
          >
        </button>

        <p style="margin: 8px 0">
          Di chuyển đến đường dẫn sau nếu không thể điều hướng tự động:
          <a style="word-break: break-all; font-size: 16px" href="${process.env.ORIGIN}/auth/reset-password/${forgotPasswordToken}"
            >${process.env.ORIGIN}/auth/reset-password/${forgotPasswordToken}</a
          >
        </p>

        <small
          style="
            text-align: center;
            width: 100%;
            display: block;
            font-size: 12px;
            margin-top: 32px;
            font-style: italic;
          "
          >Email này chỉ có hiệu lực trong vòng 10 phút, không được chia sẻ nội
          dung mail này với bất kỳ ai khác!</small
        >
      </div>
    </div>`,
    };

    transporter.sendMail(mainOptions, function (err, info) {
      //tiến hành gửi mail
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ success: false, message: "Có lỗi xảy ra" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Đã gửi mail thành công" });
      }
    });
  });

  const unlinkAvatar = async (avatarUrl) => {
    if (avatarUrl)
      if (avatarUrl.public_id) await upload.unlink(avatarUrl.public_id);
  };
  router.post("/confirm-email", async (req, res) => {
    const { params: token } = req.body;
    if (!token)
      return res
        .status(500)
        .json({ success: false, message: "Không tìm thấy token" });

    if (token)
      JWT.verify(token, process.env.confirmEmailToken, async (err, data) => {
        //Xác thực key
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Đường dẫn không chính xác" });
        }
        await user.findByIdAndUpdate(data.id, { confirmEmail: true });
        res
          .status(200)
          .json({ success: true, message: "Đã xác thực thành công" });
        groupChat.findByIdAndUpdate("61e0c632b24f444c7591c752", {
          $push: { members: data.id },
        });
      });
  });
  router.post("/confirm-sendmail", async (req, res) => {
    const { params: email } = req.body; //lấy email
    const User = await user.findOne({ email: email, deleted: false });

    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "Email chưa được đăng ký" });
    }
    if (User.confirmEmail)
      return res
        .status(400)
        .json({ success: false, message: "Email đã xác thực rồi" });
    //Cung cấp key (10 phút)
    const confirmEmailToken = JWT.sign(
      { id: User._id, email: User.email },
      process.env.confirmEmailToken,
      { expiresIn: "10m" }
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
      from: "Nhà trọ Sinh viên",
      to: User.email,
      subject: "Xác thực email đăng ký",
      text: "",
      html: `<div
      style="
        width: 100%;
        max-width: 550px;
        margin: 0 auto;
        outline: 2px solid #ccc;
        padding-bottom: 4px;
      "
    >
      <div style="padding: 8px 4px; text-align: center">
        <img
          style="width: 45px; height: 45px"
          src="https://res.cloudinary.com/dpregsdt9/image/upload/v1641390438/logo_1_h8e2hu.png"
        />

        <h1
          style="
            font-size: 20px;
            color: #2196f3;
            font-weight: 600;
            text-transform: uppercase;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 4px 0;
          "
        >
          Xác thực email đăng ký
        </h1>
      </div>

      <div
        style="
          padding: 4px 12px 8px;
          font-size: 16px;
          border-top: 1px solid #ccc;
        "
      >
        <p style="margin: 8px 0">Chào ${User.name},</p>

        <p style="margin: 8px 0">
          Tài khoản của bạn đã đăng ký
          với địa chỉ mail: ${email}
        </p>

        <p style="margin: 8px 0">
          Nếu như không phải yêu cầu đến từ phía của bạn. Hãy bỏ qua email này!
        </p>

        <p style="margin: 8px 0">
          Bấm vào nút "Xác thực" bên dưới để thực hiện xác nhận email và trở thành thành viên của chúng tôi:
        </p>

        <button
          style="
            background: none;
            outline: none;
            background: #2196f3;
            border: none;
            width: 130px;
            height: 40px;
            border-radius: 24px;
            box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.45);
            margin: 16px auto;
            display: block;
          "
        >
          <a
            style="
              color: #fff;
              text-decoration: none;
              font-size: 14px;
              display: block;
              width: 100%;
              height: 100%;
              line-height: 40px;
            "
            href="${process.env.ORIGIN}/auth/confirm-email/${confirmEmailToken}"
            >Xác thực</a
          >
        </button>

        <p style="margin: 8px 0">
          Di chuyển đến đường dẫn sau nếu không thể điều hướng tự động:
          <a style="word-break: break-all; font-size: 16px" href="${process.env.ORIGIN}/auth/confirm-email/${confirmEmailToken}"
            >${process.env.ORIGIN}/auth/confirm-email/${confirmEmailToken}</a
          >
        </p>

        <small
          style="
            text-align: center;
            width: 100%;
            display: block;
            font-size: 12px;
            margin-top: 32px;
            font-style: italic;
          "
          >Email này chỉ có hiệu lực trong vòng 10 phút, không được chia sẻ nội
          dung mail này với bất kỳ ai khác!</small
        >
      </div>
    </div>`,
    };

    transporter.sendMail(mainOptions, function (err, info) {
      //tiến hành gửi mail
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ success: false, message: "Có lỗi xảy ra" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Đã gửi mail thành công" });
      }
    });
  });
  router.post("/register", async (req, res) => {
    let {
      username,
      password,
      name,
      email,
      district,
      province,
      school,
      avatarUrl,
    } = req.body;
    if (!school || !district || !province)
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin trường đại học",
      });
    const getSchool = await schoolModel.findOne({ codeName: school });
    const getDistrict = await districtModel.findOne({ codeName: district });
    const getProvince = await provinceModel.findOne({ codeName: province });
    if (!username || !password) {
      await unlinkAvatar(avatarUrl);
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không được bỏ trống",
      });
    }
    if (!name) {
      await unlinkAvatar(avatarUrl);
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ họ tên" });
    }
    if (!email) {
      await unlinkAvatar(avatarUrl);
      return res
        .status(400)
        .json({ success: false, message: "Email không được để trống" });
    }
    if (!school || !district || !province) {
      await unlinkAvatar(avatarUrl);
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp đủ thông tin" });
    }
    const checkUser = await user.findOne({
      username: username,
      deleted: false,
    });
    if (checkUser) {
      await unlinkAvatar(avatarUrl);
      return res
        .status(400)
        .json({ success: false, message: "Tên đăng nhập đã được sử dụng" });
    }
    const checkEmail = await user.findOne({ email: email, deleted: false });

    if (checkEmail) {
      await unlinkAvatar(avatarUrl);
      return res
        .status(400)
        .json({ success: false, message: "Lỗi! Email đã được sử dụng" });
    }
    if (!avatarUrl)
      avatarUrl = {
        url: "https://res.cloudinary.com/dpregsdt9/image/upload/v1631352198/user-avatar/avatar-default_vzl8ur.jpg",
      };

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
        district: getDistrict,
        province: getProvince,
        school: getSchool,
      });
      await newUser.save();
      res.status(200).json({ success: true, message: "Đăng ký thành công" });

      io.sendDashboardStatisticals("accounts");
    } catch (err) {
      await unlinkAvatar(avatarUrl);
      res.status(401).json({
        success: false,
        message: "Đã có lỗi xảy ra! vui lòng thử lại",
        err,
      });
    }
  });

  //đăng nhập
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const { authorization } = req.headers;
    let userID = undefined;
    let checkUser;

    try {
      if (Boolean(username) && Boolean(password)) {
        checkUser = await user
          .findOne({ username: username, deleted: false })
          .select("-unsignedName -deleted")
          .populate(
            "likes",
            "avatarUrl name isAdmin _id credit email posts motels rank school likes"
          );

        if (checkUser == null)
          return res
            .status(404)
            .json({ success: false, message: "Tên đăng nhập bị sai" });

        const pass = await argon2.verify(checkUser.password, password);
        if (!pass)
          return res
            .status(404)
            .json({ success: false, message: "Mật khẩu bị sai" });
      } else {
        let userData;
        try {
          userData = JWT.verify(authorization, process.env.accessToken);
        } catch (err) {
          console.log(err);
          if (err.name === "TokenExpiredError")
            return res
              .status(401)
              .json({ success: false, message: "Token hết hạn" });
          else
            return res
              .status(500)
              .json({ success: false, message: "Lỗi không xác định" });
        }
        userID = userData.id;
      }

      if (userID)
        checkUser = await user
          .findOne({ _id: userID, deleted: false })
          .select("-unsignedName")
          .populate(
            "likes",
            "avatarUrl name isAdmin _id credit email posts motels rank school likes"
          );
      if (checkUser)
        if (checkUser.banned)
          if (new Date(checkUser.banned) - new Date(Date.now()) > 0)
            return res.status(400).json({
              message: `Tài khoản của bạn đã bị khóa đến ${new Date(
                checkUser.banned
              ).getHours()}:${new Date(
                checkUser.banned
              ).getMinutes()}:${new Date(
                checkUser.banned
              ).getSeconds()} ngày ${new Date(checkUser.banned).getDate()}-${
                new Date(checkUser.banned).getMonth() + 1
              }-${new Date(checkUser.banned).getFullYear()}`,
              success: false,
            });

      const newAccessToken = JWT.sign(
        {
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
          credit: checkUser.credit,
        },
        process.env.accessToken,
        { expiresIn: "10m" }
      );
      const url = checkUser.avatarUrl.url;
      const key = uuid.v4();
      const newRefreshToken = JWT.sign(
        {
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
          credit: checkUser.credit,
        },
        key
      );

      checkUser.refreshToken = newRefreshToken;
      await checkUser.save();
      const groupChatUser = await groupChat.find({ members: checkUser._id });

      const data = {
        ...checkUser._doc,
        avatarUrl: url,
        groupPrivate: groupChatUser
          .filter(
            (group) => (group.type = "private" && group.members.length < 3)
          )
          .map((group) => {
            return { ...group._doc, messages: undefined };
          }),
        numMessages: groupChatUser.reduce((s, group) => {
          return (s += group.messages.filter(
            (message) =>
              !message.seen.some(
                (see) => JSON.stringify(checkUser._id) === JSON.stringify(see)
              )
          ).length);
        }, 0),
      };
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          ...data,
          likes: data.likes.map((item) => {
            return {
              ...item._doc,
              avatarUrl: item.avatarUrl.url,
              totalLikes: item.likes.length,
            };
          }),
          notify: [...data.notify].sort((n1, n2) => {
            return new Date(n2.createdAt) - new Date(n1.createdAt);
          }),
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Lỗi không xác định",
        success: false,
      });
    }
  });

  router.post("/logout", verifyToken, async (req, res) => {
    if (!req.user.id)
      return res.status(400).json({
        success: false,
        message: "Yêu cầu gửi lên thông tin đăng xuất",
      });
    const id = req.user.id;
    const check = await user.findOne({ _id: id, deleted: false });

    if (!check)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy ngươi dùng" });

    check.refreshToken = "";
    await check.save();
    res.status(200).json({ success: true, message: "Đã đăng xuất" });
    io.logout(check._id);
  });

  router.post("/register-facebook", async (req, res) => {
    const { accessToken, userID, email, district, school, province } = req.body;
    if (!school || !district || !province)
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin trường đại học",
      });
    const url = `https://graph.facebook.com/v4.0/${userID}/?fields=id,email,name,picture
    &access_token=${accessToken}`;
    const data = await axios.get(url);
    const { id, name, picture } = data.data;

    const checkUser = await user.findOne({
      $or: [
        { username: id },
        {
          email: email,
        },
      ],
      deleted: false,
    });
    if (checkUser)
      return res.status(400).json({
        message: "Tài khoản facebook hoặc email này đã được sử dụng",
        success: false,
      });
    const getSchool = await schoolModel.findOne({ codeName: school });
    const getDistrict = await districtModel.findOne({ codeName: district });
    const getProvince = await provinceModel.findOne({ codeName: province });
    const password = id + process.env.PASSWORD_SECRET_FACEBOOK;
    const unsignedName = removeVietnameseTones(name);
    const newUser = new user({
      username: id,
      password: await argon2.hash(password),
      name,
      unsignedName,
      avatarUrl: { url: picture.data.url },
      credit: undefined,
      favorite: undefined,
      isAdmin: undefined,
      email,
      district: getDistrict,
      province: getProvince,
      school: getSchool,
      confirmEmail: false,
    });
    await newUser.save();

    const newAccessToken = JWT.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin, credit: 0 },
      process.env.accessToken,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        accessToken: newAccessToken,
      },
    });
    groupChat.findByIdAndUpdate("61e0c632b24f444c7591c752", {
      $push: { members: newUser._id },
    });
    io.sendDashboardStatisticals("accounts");
  });

  router.post("/login-facebook", async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      const url = `https://graph.facebook.com/v4.0/${userID}/?fields=id,email,name,picture
    &access_token=${accessToken}`;
      const data = await axios.get(url);

      const { id } = data.data;
      const checkUser = await user.findOne({ username: id, deleted: false });
      if (!checkUser)
        return res.status(200).json({
          message: "Cần bổ sung một số dữ liệu để hoàn tất",
          success: false,
        });
      const password = id + process.env.PASSWORD_SECRET_FACEBOOK;
      const isMatch = await argon2.verify(checkUser.password, password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Mật khẩu bị sai", success: false });

      //good
      const newAccessToken = JWT.sign(
        {
          id: checkUser._id,
          isAdmin: checkUser.isAdmin,
          credit: checkUser.credit,
        },
        process.env.accessToken,
        { expiresIn: "10m" }
      );

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Lỗi không xác định",
        success: false,
      });
    }
  });

  router.post("/register-google", async (req, res) => {
    const { tokenId, school, district, province } = req.body;
    if (!school || !district || !province)
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin trường đại học",
      });
    const result = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.SERVICE_CLIENT_ID,
    });
    const userGmail = result.getPayload();

    if (!userGmail.email_verified)
      return res
        .status(400)
        .json({ success: false, message: "Email chưa xác thực" });
    const checkUser = await user.findOne({
      email: userGmail.email,
      deleted: false,
    });
    if (checkUser)
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng" });
    const password = userGmail.email + process.env.PASSWORD_SECRET_GOOGLE;
    const { email, picture, name } = userGmail;
    const unsignedName = removeVietnameseTones(name);
    const getSchool = await schoolModel.findOne({ codeName: school });
    const getDistrict = await districtModel.findOne({ codeName: district });
    const getProvince = await provinceModel.findOne({ codeName: province });
    const newUser = new user({
      username: email,
      password: await argon2.hash(password),
      name,
      unsignedName,
      avatarUrl: { url: picture },
      credit: undefined,
      favorite: undefined,
      isAdmin: undefined,
      email,
      district: getDistrict,
      province: getProvince,
      school: getSchool,
      confirmEmail: true,
    });
    await newUser.save();
    const newAccessToken = JWT.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin, credit: 0 },
      process.env.accessToken,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        accessToken: newAccessToken,
      },
    });
    groupChat.findByIdAndUpdate("61e0c632b24f444c7591c752", {
      $push: { members: newUser._id },
    });
    io.sendDashboardStatisticals("accounts");
  });

  router.post("/login-google", async (req, res) => {
    const { tokenId } = req.body;
    console.log(tokenId);
    const result = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.SERVICE_CLIENT_ID,
    });
    const userGmail = result.getPayload();
    const checkUser = await user.findOne({
      email: userGmail.email,
      deleted: false,
    });

    if (!userGmail.email_verified)
      return res
        .status(400)
        .json({ success: false, message: "Email chưa được sử dụng" });

    if (!checkUser)
      return res.status(200).json({
        success: false,
        message: "Cần bổ sung một số dữ liệu để hoàn tất",
      });

    if (!tokenId) {
      const password = userGmail.email + process.env.PASSWORD_SECRET_GOOGLE;
      const isMatch = await argon2.verify(checkUser.password, password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu bị sai" });
    }

    const newAccessToken = JWT.sign(
      {
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
        credit: checkUser.credit,
      },
      process.env.accessToken,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      message: "Đăng nhap thành công",
      data: {
        accessToken: newAccessToken,
      },
    });
  });
  return router;
};
module.exports = authRouter;
