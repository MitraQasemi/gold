const express = require("express");
const route = express.Router();

const jwtMiddleware = require("../../../middlewares/jwtMiddleware");
const { adminSignup, adminLogin,adminLogout } = require("../../../../services/admin/auth");

const func = (app) => {
    app.use(route);
    route.post("/adminSignup", async (req, res, next) => {
        try {
            const result = await adminSignup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogin", async (req, res, next) => {
        try {
            const result = await adminLogin(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogout",jwtMiddleware, async (req, res, next) => {
        try {
            const result = await adminLogout(req.user);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;