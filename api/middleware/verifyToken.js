const JWT = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token)
        JWT.verify(token, process.env.accessToken, async (err, data) => {
            if (err) return res.status(401).json("Token không đúng");
            req.user = data;

            next();
        });
    else res.status(400).json("Yêu cầu xác thực (không tìm thấy accessToken)");
};
module.exports = verifyToken;