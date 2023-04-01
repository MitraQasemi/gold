const jwt = require("jsonwebtoken")
const { ApiError } = require("./error");

module.exports = (req, res, next) => {
    const token = req.headers["access-token"]
    if (!token) {
        return next(new ApiError(401, "token is required"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
        req.user = decoded;
    } catch (err) {
        return next(new ApiError(401, "token invalid"));
    }
    next();
}