const express = require("express");
const route = express.Router();
const {isAuth} = require("../../../middlewares");
const {userSignupVerification, userSignup, userLogin, userLogout} = require("../../../../services/user/auth");

const func = (app) => {
    app.use(route);
    route.post("/userSignup", async (req, res, next) => {
        try {
            const {phoneNumber} = req.body;
            const result = await userSignup(phoneNumber);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userLogin", async (req, res, next) => {
        try {
            const {phoneNumber, password} = req.body;
            const result = await userLogin(phoneNumber, password);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userSignupVerification", async (req, res, next) => {
        try {
            const {phoneNumber, code, password} = req.body;
            const result = await userSignupVerification(phoneNumber, code, password);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userLogout", isAuth, async (req, res, next) => {
        try {
            const {id} = req.user;
            const result = await userLogout(id);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;