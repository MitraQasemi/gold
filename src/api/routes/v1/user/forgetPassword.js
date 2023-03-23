const express = require("express");
const route = express.Router();

const { forgetPassword, forgetPasswordVerification } = require("../../../../services/user/forgetPassword.js");
const {userSignupValidate, userSignupVerificationValidate} = require("../../../../services/validation/userAuth");

const func = (app) => {
    app.use(route);
    route.post("/forgetPassword", async (req, res, next) => {
        const {error} = userSignupValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await forgetPassword(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/forgetPasswordVerification", async (req, res, next) => {
        const {error} = userSignupVerificationValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await forgetPasswordVerification(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;