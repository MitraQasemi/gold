const express = require("express");
const route = express.Router();

const {isAuth, isCan, attachCurrentAdmin, validate} = require("../../../middlewares");
const userCrudValidation = require("../../../../validation/userCrud");
const {getUser, createUser, editUser, getManyUser} = require("../../../../services/admin/userManage");

const func = (app) => {
    app.use(route);
    route.get("/admin/user/:id", validate(userCrudValidation.read), isAuth, attachCurrentAdmin, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getUser(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

    route.get("/admin/user", validate(userCrudValidation.readMany), isAuth, attachCurrentAdmin, isCan("read", "User"), async (req, res, next) => {
        try {
            const result = await getManyUser(req.query)
            res.setHeader("count",result.count)
            return res.send(result.result)
        } catch (error) {
            return next(error);
        }
    })

    route.post("/admin/user", validate(userCrudValidation.create), isAuth, attachCurrentAdmin, isCan("create", "User"), async (req, res, next) => {
        try {
            const result = await createUser(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/admin/user/:id", validate(userCrudValidation.update), isAuth, attachCurrentAdmin, isCan("update", "User"), async (req, res, next) => {
        try {
            const result = await editUser(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;