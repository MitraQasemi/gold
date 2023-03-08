const express = require("express");
const route = express.Router();

const { forgetPassword } = require("../../../services/user/forgetPassword.js");

const func = (app) => {
    app.use(route);
    route.post("/forgetPassword", async (req, res, next) => {
        try {
            const result = await forgetPassword(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;