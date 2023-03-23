const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentUser} = require("../../../middlewares");

const {getAdmin, createAdmin, editAdmin} = require("../../../../services/admin/adminManage");
const {createAdminValidate, updateAdminValidate} = require("../../../../services/validation/adminCrud");
const {idValidate} = require("../../../../services/validation/checkId");

const func = (app) => {

    app.use(route);

    route.get("/admin/:id", isAuth, attachCurrentUser, isCan("read", "Admin"), async (req, res, next) => {
        const {err} = idValidate(req.params);
        if (err) {
            return res.send(err.details)
        }
        try {
            const result = await getAdmin(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/admin", isAuth, attachCurrentUser, isCan("create", "Admin"), async (req, res, next) => {
        const {error} = createAdminValidate(req.body);
        if (error) {
            return res.send(error.details)
        }
        try {
            const result = await createAdmin(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/admin/:id", isAuth, attachCurrentUser, isCan("update", "Admin"), async (req, res, next) => {
        const {err} = idValidate(req.params);
        if (err) {
            return res.send(err.details);
        }
        const {error} = updateAdminValidate(req.body);
        if (error) {
            return res.send(error.details);
        }
        try {
            const result = await editAdmin(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;