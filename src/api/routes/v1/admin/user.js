const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentUser} = require("../../../middlewares");

const {getUser, createUser, editUser} = require("../../../../services/admin/userManage");
const {idValidate} = require("../../../../services/validation/checkId");
const {createUserValidate, updateUserValidate} = require("../../../../services/validation/userCrud");

const func = (app) => {

    app.use(route);

    route.get("/user/:id", isAuth, attachCurrentUser, isCan("read", "User"), async (req, res, next) => {
        const {err} = idValidate(req.params);
        if (err) {
            return res.send(err.details)
        }

        try {
            const result = await getUser(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/user", isAuth, attachCurrentUser, isCan("create", "User"), async (req, res, next) => {
        const {error} = createUserValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await createUser(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/user/:id", isAuth, attachCurrentUser, isCan("update", "User"), async (req, res, next) => {
        const {err} = idValidate(req.params);
        if (err) {
            return res.send(err.details)
        }
        const {error} = updateUserValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await editUser(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;