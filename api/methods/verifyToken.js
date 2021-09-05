const JWT = require("jsonwebtoken");

const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization;
    if (token)
        JWT.verify(token, process.env.accessToken, async(err, data) => {
            if (err) res.status(401).json("Token không đúng");
            req.user = data;
        });
    else res.status(401).json("Yêu cầu xác thực");
};
module.exports = verifyToken;