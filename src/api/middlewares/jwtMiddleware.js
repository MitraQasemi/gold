require("dotenv").config({path: "../.env"});

const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        res.send("no token found")
    }
    try {
        let user = await JWT.verify(token, process.env.JWT_SECRET_ACCESS );
        req.user = user;
        next();
    } catch (e) {
        res.send("token invalid")
    }
}