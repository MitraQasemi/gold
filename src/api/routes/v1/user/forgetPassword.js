const express = require("express");
const route = express.Router();

const { forgetPassword, forgetPasswordVerification } = require("../../../../services/user/forgetPassword.js");

const func = (app) => {
    app.use(route);
    route.post("/forgetPassword", async (req, res, next) => {
        try {
            const {phoneNumber} = req.body;
            const result = await forgetPassword(phoneNumber);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/forgetPasswordVerification", async (req, res, next) => {
        try {
            const {phoneNumber, code, password} = req.body;
            const result = await forgetPasswordVerification(phoneNumber, code, password);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;