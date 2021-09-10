const cloudinary = require("cloudinary");
fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.CLOUND_API_KEY,
    api_secret: process.env.CLOUND_API_SECRET,
});

const upload = async(file) => {
    try {
        let rel;
        if (!file || Object.keys(file).length == 0)
            return { success: false, message: "Không có file" };
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
            return {
                success: false,
                message: "Chỉ cho phép định dạng jpeg(jpg) hoặc png",
            };
        if (file.size > 1024 * 1024)
            return { success: false, message: "Dung lượng file quá lớn" };
        file.tempFilePath = "./tmp/" + Date.now();
        fs.writeFile(file.tempFilePath, file.data, function(err) {
            if (err) return console.log(err);
        });
        await cloudinary.v2.uploader.upload(
            file.tempFilePath,
            function(error, result) {
                if (error) throw error;
                else {
                    rel = result;
                    fs.unlink(file.tempFilePath, (err) => {
                        return;
                    });
                }
            }
        );
        return { success: true, message: "thành công", data: rel };
    } catch (err) {
        console.log(err);
        return { success: false, message: "Lỗi không xác định" };
    }
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