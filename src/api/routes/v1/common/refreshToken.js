const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { AdminRefreshToken, UserRefreshToken } = require("../../../../services/common/refreshToken")
const func = (app) => {
    app.use(route);
    route.post("/AdminRefreshToken", async (req, res, next) => {
        const token = req.body.token;
        try {
            const result = await AdminRefreshToken(token);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/UserRefreshToken", async (req, res, next) => {
        const token = req.body.token;
        try {
            const result = await UserRefreshToken(token);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;