const cloudinary = require("cloudinary");
fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.CLOUND_API_KEY,
    api_secret: process.env.CLOUND_API_SECRET,
});

const upload = async(req, res, next) => {
    var files;
    const f = Object.values(req.files);

    if (f[0].constructor.name === "Array") files = [...f[0]];
    else if (f[0].constructor.name === "Object") files = f;

    if (!files || files.length == 0)
        return res.status(400).json({ success: false, message: "Không có file" });

    files.forEach(async(file) => {
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
            return res.status(400).json({
                success: false,
                message: "Chỉ cho phép định dạng jpeg(jpg) hoặc png (file " + file.name + ")",
            });
        if (file.size > 512 * 1024)
            return res.status(400).json({
                success: false,
                message: "Dung lượng file" + file.name + " quá lớn",
            });
    });
    req.results = [];
    for (let i = 0; i < files.length; i++) {
        try {
            files[i].tempFilePath = "./tmp/" + Date.now();
            fs.writeFile(files[i].tempFilePath, files[i].data, function(err) {
                if (err) return res.status(400).json({ msg: "loi roi" });
            });
            await cloudinary.v2.uploader.upload(
                files[i].tempFilePath,
                function(error, result) {
                    {
                        req.results.push({ url: result.url, public_id: result.public_id });
                        fs.unlink(files[i].tempFilePath, (err) => {
                            return;
                        });
                    }
                }
            );
        } catch (err) {
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
            if (err) throw err;
            rel = result;
        });
        return { success: true, message: "thành công", data: rel };
    } catch {
        console.log(err);
        return { success: false, message: "Lỗi không xác định" };
    }
};
module.exports = { upload, unlink };