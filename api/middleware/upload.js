const cloudinary = require("cloudinary");

fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.CLOUND_API_KEY,
    api_secret: process.env.CLOUND_API_SECRET,
});

const upload = async(req, res, next) => {
    if (!req.files)
        return res.status(400).json({ success: false, message: "Khong co file" });
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
                success: false,
                message: "Chỉ cho phép định dạng jpeg(jpg) hoặc png (file " + file.name + ")",
            });
        if (file.size > 500 * 1024)
            return res.status(400).json({
                success: false,
                message: "Dung lượng file" + file.name + " quá lớn",
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
            await fs.writeFile(files[i].tempFilePath, files[i].data, function(err) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "Xảy ra lỗi trong quá trình tải hình ảnh!",
                    });
                }
            });
            console.log(files[i].tempFilePath);
            await cloudinary.v2.uploader.upload(
                files[i].tempFilePath, { folder: req.body.folder },
                function(error, result) {
                    if (error) console.log(error);
                    if (result) {
                        req.results.push({ url: result.url, public_id: result.public_id });
                        fs.unlink(files[i].tempFilePath, (err) => {
                            if (err)
                                return res.status(400).json({
                                    success: false,
                                    message: "Xảy ra lỗi trong quá trình tải hình ảnh!",
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

const unlink = async(public_id) => {
    try {
        let rel;
        await cloudinary.v2.uploader.destroy(public_id, (err, result) => {
            if (err) console.log(err);
            rel = result;
        });
        return { success: true, message: "Thành công", data: rel };
    } catch {
        console.log(err);
        return { success: false, message: "Lỗi không xác định" };
    }
};
const rename = async(public_id, newPublic_id) => {
    let res;
    await cloudinary.v2.uploader.rename(
        public_id,
        newPublic_id,
        (err, result) => {
            if (err) {
                console.log(err);
                res = undefined;
            } else res = result;
        }
    );
    const folderToDelete = public_id.split("/");
    cloudinary.v2.api.delete_folder(folderToDelete[0], async(err, result) => {
        if (err) throw err;
    });
    if (res == undefined) return { success: false };
    else return { success: true, data: res };
};
module.exports = { upload, unlink, rename };