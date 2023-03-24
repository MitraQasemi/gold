const express = require("express");
const route = express.Router();

const {isAuth} = require("../../../middlewares");
const {adminSignup, adminLogin, adminLogout} = require("../../../../services/admin/auth");

const func = (app) => {
    app.use(route);
    route.post("/adminSignup", async (req, res, next) => {
        try {
            const {username, password, permissions} = req.body;
            const result = await adminSignup(username, password, permissions);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogin", async (req, res, next) => {
        try {
            const {username, password} = req.body;
            const result = await adminLogin(username, password);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/adminLogout", isAuth, async (req, res, next) => {
        try {
            const {id} = req.user;
            const result = await adminLogout(id);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;