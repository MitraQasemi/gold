const authRoutesV1 = require("./v1/routes/auth.js");

const express = require("express");

const api = () => {

    const router = express.Router();
    authRoutesV1(router);
    return router;
}
module.exports = api;