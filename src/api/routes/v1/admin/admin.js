const express = require("express");
const route = express.Router();
const {isAuth, isCan, attachCurrentUser} = require("../../../middlewares");

const {getAdmin, createAdmin, editAdmin} = require("../../../../services/admin/adminManage");

const func = (app) => {

    app.use(route);

    route.get("/admin/:id", isAuth, attachCurrentUser, isCan("read", "Admin"), async (req, res, next) => {
        try {
            const result = await getAdmin(req.params.id)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
    route.post("/admin", isAuth, attachCurrentUser, isCan("create", "Admin"), async (req, res, next) => {
        try {
            const {username, password, permissions} = req.body;
            const result = await createAdmin(username, password, permissions)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })


    route.put("/admin/:id", isAuth, attachCurrentUser, isCan("update", "Admin"), async (req, res, next) => {
        try {
            const result = await editAdmin(req.params.id, req.body)
            return res.send(result)
        } catch (error) {
            return next(error);
        }
    })
}

module.exports = func;