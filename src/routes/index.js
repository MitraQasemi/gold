const adminAuthRoutesV1 = require("./v1/admin/auth.js");

const express = require("express");

const api = () => {

    const router = express.Router();
    adminAuthRoutesV1(router);
    return router;
}
module.exports = api;