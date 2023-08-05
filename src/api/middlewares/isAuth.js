const jwt = require("jsonwebtoken")
const { ApiError } = require("./error");

module.exports = (req, res, next) => {
    const token = req.headers["access-token"]
    if (!token) {
        return next(new ApiError(401, "!اجازه دسترسی داده نمیشود؛توکن وجود ندارد"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS, (error, decoded) => {
            if (error) {
                return next(new ApiError(413, "!اجازه دسترسی داده نمیشود؛توکن اشتباه است"));
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        return next(new ApiError(411, "!اجازه دسترسی داده نمیشود؛توکن اشتباه است"));
    }
}