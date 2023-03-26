const express = require("express");
const route = express.Router();

const {isAuth, isCan, attachCurrentUser, validate} = require("../../../middlewares");

const adminCrudValidation = require("../../../../validation/adminCrud");
const {getAdmin, createAdmin, editAdmin} = require("../../../../services/admin/adminManage");

const func = (app) => {

    app.use(route);


    route.get("/admin/:id",validate(adminCrudValidation.read), isAuth, attachCurrentUser, isCan("read", "Admin"), async (req, res, next) => {
        try {
            const result = await getAdmin(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

    route.post("/admin",validate(adminCrudValidation.create), isAuth, attachCurrentUser, isCan("create", "Admin"), async (req, res, next) => {
        try {
            const {username, password, permissions} = req.body;
            const result = await createAdmin(username, password, permissions)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })

    route.put("/admin/:id",validate(adminCrudValidation.update), isAuth, attachCurrentUser, isCan("update", "Admin"), async (req, res, next) => {
        try {
            const result = await editAdmin(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;