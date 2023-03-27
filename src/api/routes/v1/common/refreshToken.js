const express = require("express");
const route = express.Router();
const {AdminRefreshToken, UserRefreshToken} = require("../../../../services/common/refreshToken")
const func = (app) => {
    app.use(route);
    route.post("/AdminRefreshToken", async (req, res, next) => {
        const token = req.header("refresh-token");
        if (!token) {
            return res.send("no token found")
        }
        try {
            const result = await AdminRefreshToken(token);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/UserRefreshToken", async (req, res, next) => {
        const token = req.header("refresh-token");
        if (!token) {
            return res.send("no token found")
        }
        try {
            const result = await UserRefreshToken(token);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;