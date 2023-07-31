const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const userAuthValidation = require("../../../../validation/userAuth")
const { userSignupVerification, userSignup, userLogin, userLogout } = require("../../../../services/user/auth");
const { forgetPassword, forgetPasswordVerification } = require("../../../../services/user/forgetPassword");

const func = (app) => {
    app.use(route);
    route.post("/user/signup", validate(userAuthValidation.signup), async (req, res, next) => {
        try {
            const { phoneNumber } = req.body;
            const result = await userSignup(phoneNumber);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/user/login", validate(userAuthValidation.login), async (req, res, next) => {
        try {
            const { phoneNumber, password } = req.body;
            const result = await userLogin(phoneNumber, password);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/user/signup/verification", validate(userAuthValidation.signupVerification), async (req, res, next) => {
        try {
            const { phoneNumber, code, password } = req.body;
            const result = await userSignupVerification(phoneNumber, code, password);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/user/logout", isAuth, async (req, res, next) => {
        try {
            const { id } = req.user;
            const result = await userLogout(id);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/user/forgetPassword", validate(userAuthValidation.forgetPassword), async (req, res, next) => {
        try {
            const { phoneNumber } = req.body;
            const result = await forgetPassword(phoneNumber);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/user/forgetPasswordVerification", validate(userAuthValidation.forgetPasswordVerification), async (req, res, next) => {
        try {
            const { phoneNumber, code, password } = req.body;
            const result = await forgetPasswordVerification(phoneNumber, code, password);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;