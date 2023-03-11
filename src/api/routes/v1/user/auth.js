const express = require("express");
const route = express.Router();

const { userSignupVerification, userSignup, userLogin } = require("../../../../services/user/auth");

const func = (app) => {
    app.use(route);
    route.post("/userSignup", async (req, res, next) => {
        try {
            const result = await userSignup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userLogin", async (req, res, next) => {
        try {
            const result = await userLogin(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/userSignupVerification", async (req, res, next) => {
        try {
            const result = await userSignupVerification(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;