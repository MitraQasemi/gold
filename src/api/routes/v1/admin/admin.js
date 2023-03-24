const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentUser} = require("../../../middlewares");

const {getAdmin, createAdmin, editAdmin, deleteAdmin} = require("../../../../services/admin/adminManage");

const func = (app) => {

    app.use(route);

    route.get("/admin/:adminId", isAuth, attachCurrentUser, isCan("read", "Admin"), async (req, res, next) => {
        try {
            const result = await getAdmin(req.params.adminId)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/admin", isAuth, attachCurrentUser, isCan("create", "Admin"), async (req, res, next) => {
        try {
            const result = await createAdmin(req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/admin/:adminId", isAuth, attachCurrentUser, isCan("update", "Admin"), async (req, res, next) => {
        try {
            const result = await editAdmin(req.params.adminId, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;