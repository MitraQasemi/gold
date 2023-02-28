const express = require("express");
const route = express.Router();

const { signup, login } = require("../../../services/auth");

const func = (app) => {
    app.use(route);
    route.post("/v1/signup", async (req, res, next) => {
        try {
            const result = await signup(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })

    route.post("/v1/login", async (req, res, next) => {
        try {
            const result = await login(req.body);
            return res.send(result);
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;