const express = require("express");
const route = express.Router();
const { ApiError } = require("../../../middlewares/error");
const { isAuth, validate } = require("../../../middlewares");
const authValidation = require("../../../../validation/adminAuth");
const { adminSignup, adminLogin, adminLogout } = require("../../../../services/admin/auth");

const func = (app) => {
    app.use(route);
    route.post("/admin/signup", validate(authValidation.signup), async (req, res, next) => {
        try {
            const { username, password, permissions } = req.body;
            const result = await adminSignup(username, password, permissions);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/admin/login", validate(authValidation.login), async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await adminLogin(username, password);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })

    route.post("/admin/logout", isAuth, async (req, res, next) => {
        try {
            const { id } = req.user;
            const result = await adminLogout(id);
            return res.send(result);
        } catch (error) {
            return next(new ApiError(error.statusCode || 500, error.message));
        }
    })
}

module.exports = func;