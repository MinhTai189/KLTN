const cloudinary = require("cloudinary");
fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUND_NAME2,
  api_key: process.env.CLOUND_API_KEY2,
  api_secret: process.env.CLOUND_API_SECRET2,
});

const upload = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUND_NAME2,
    api_key: process.env.CLOUND_API_KEY2,
    api_secret: process.env.CLOUND_API_SECRET2,
  });
  if (!req.files)
    return res.status(400).json({
      error: {
        message: "Không tìm thấy file",
      },
    });
  var files;

  const f = Object.values(req.files);

  if (f[0].constructor.name === "Array") {
    files = [...f[0]];
  } else if (f[0].constructor.name === "Object") files = f;

  if (!files || files.length == 0)
    return res.status(400).json({ success: false, message: "Không có file" });

  files.forEach((file) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
      return res.status(400).json({
        error: {
          message:
            "Chỉ cho phép định dạng jpeg(jpg) hoặc png (file " +
            file.name +
            ")",
        },
      });
    if (file.size > 500 * 1024)
      return res.status(400).json({
        error: {
          message: "Dung lượng file" + file.name + " quá lớn",
        },
      });
  });

  req.results = [];
  for (let i = 0; i < files.length; i++) {
    try {
      files[i].tempFilePath =
        "./tmp/" +
        Date.now() +
        "." +
        files[i].mimetype.substr(files[i].mimetype.indexOf("/") + 1);
      await fs.writeFile(files[i].tempFilePath, files[i].data, function (err) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: {
              message: "Xảy ra lỗi trong quá trình tải hình ảnh!",
            },
          });
        }
      });
      await cloudinary.v2.uploader.upload(
        files[i].tempFilePath,
        { folder: req.body.folder },
        function (error, result) {
          if (error) console.log(error);
          if (result) {
            req.results.push({ url: result.url, public_id: result.public_id });
            fs.unlink(files[i].tempFilePath, (err) => {
              if (err)
                return res.status(400).json({
                  error: {
                    message: "Xảy ra lỗi trong quá trình tải hình ảnh!",
                  },
                });
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      for (let i = 0; i < req.results.length; i++) {
        await unlink(req.results[i].public_id);
      }
      req.results = [];
    }
  }

  next();
};

module.exports = upload;
