const express = require("express");
const route = express.Router();
const {isAuth} = require("../../../middlewares");
const {userSignupVerification, userSignup, userLogin, userLogout} = require("../../../../services/user/auth");
const {userSignupValidate, userSignupVerificationValidate, userLoginValidate} = require("../../../../services/validation/userAuth")
const func = (app) => {
    app.use(route);
    route.post("/userSignup", async (req, res, next) => {
        const {error} = userSignupValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await userSignup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userLogin", async (req, res, next) => {
        const {error} = userLoginValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await userLogin(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userSignupVerification", async (req, res, next) => {
        const {error} = userSignupVerificationValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await userSignupVerification(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userLogout", isAuth, async (req, res, next) => {
        try {
            const result = await userLogout(req.admin);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;