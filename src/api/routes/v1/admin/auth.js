const express = require("express");

const route = express.Router();

const {isAuth} = require("../../../middlewares");
const {adminAuthSchemaValidate} = require("../../../../services/validation/adminAuth")

const {adminSignup, adminLogin, adminLogout} = require("../../../../services/admin/auth");

const func = (app) => {
    app.use(route);
    route.post("/adminSignup", async (req, res, next) => {

        const {error} = adminAuthSchemaValidate(req.body);
        if (error) {
            return res.send(error.details)
        }

        try {
            const result = await adminSignup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogin", async (req, res, next) => {
        const {error} = adminAuthSchemaValidate(req.body);
        if (error) {
            return res.send(error.details)
        }

        try {
            const result = await adminLogin(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogout", isAuth, async (req, res, next) => {
        try {
            const result = await adminLogout(req.admin);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;