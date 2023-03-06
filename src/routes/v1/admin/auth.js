const express = require("express");
const route = express.Router();

const { adminSignup, adminLogin } = require("../../../services/admin/auth");

const func = (app) => {
    app.use(route);
    route.post("/adminSignup/v1", async (req, res, next) => {
        try {
            const result = await adminSignup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogin/v1", async (req, res, next) => {
        try {
            const result = await adminLogin(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;