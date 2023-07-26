const express = require("express");
const cors = require("cors");
const httpStatus = require('http-status-codes');
const { errorHandler } = require("../api/middlewares/error")
require("dotenv").config({ path: "../.env" });
const {ApiError} = require("../api/middlewares/error")
const routes = require("../api/routes/v1");

const expressLoader = async (app) => {
    
    app.use(cors({
        origin: '*',
      }));
    app.use(express.json());
    app.use("/v1", routes());

    app.listen(process.env.PORT, () => {
        console.log(`on port ${process.env.PORT}`);
    })

    app.use((req, res, next) => {
        next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    });

    app.use(errorHandler);

}
module.exports = expressLoader;