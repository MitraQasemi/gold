const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentUser} = require("../../../middlewares");

const {getUser, createUser, editUser, deleteUser} = require("../../../../services/admin/userManage");

const func = (app) => {

    app.use(route);

    route.get("/user/:userId", isAuth, attachCurrentUser, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getUser(req.params.userId)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/user", isAuth, attachCurrentUser, isCan("create", "User"), async (req, res, next) => {
        try {
            const result = await createUser(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/user/:userId", isAuth, attachCurrentUser, isCan("update", "User"), async (req, res, next) => {
        try {
            const result = await editUser(req.params.userId, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

    route.delete("/user/:userId", isAuth, attachCurrentUser, isCan("delete", "User"), async (req, res, next) => {
        try {
            const result = await deleteUser(req.params.userId)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;