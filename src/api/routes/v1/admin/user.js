const express = require("express");
const route = express.Router();

const {isAuth, isCan, attachCurrentUser, validate} = require("../../../middlewares");
const userCrudValidation = require("../../../../validation/userCrud");
const {getUser, createUser, editUser} = require("../../../../services/admin/userManage");

const func = (app) => {
    app.use(route);
    route.get("/user/:id", validate(userCrudValidation.read), isAuth, attachCurrentUser, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getUser(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/user", validate(userCrudValidation.create), isAuth, attachCurrentUser, isCan("create", "User"), async (req, res, next) => {
        try {
            const result = await createUser(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/user/:id", validate(userCrudValidation.update), isAuth, attachCurrentUser, isCan("update", "User"), async (req, res, next) => {
        try {
            const result = await editUser(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;