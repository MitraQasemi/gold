const express = require("express");
const route = express.Router();
const {refreshToken} = require("../../../../services/common/refreshToken")
const func = (app) => {
    app.use(route);
    route.post("/refreshToken", async (req, res, next) => {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.send("no token found")
        }
        try {
            const result = await refreshToken(token);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;