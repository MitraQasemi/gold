const express = require("express");
const cors = require("cors");
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status-codes');
const { errorHandler } = require("../api/middlewares/error")
require("dotenv").config({ path: "../.env" });
const { ApiError } = require("../api/middlewares/error")
const routes = require("../api/routes/v1");
const { request } = require("http");

const expressLoader = async (app) => {
    const limiter = rateLimit({
        windowMs: 2 * 60 * 1000, // 15 minutes
        max: 15, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
    });

    app.use(limiter);
    app.use(helmet());
    app.use(express.static(path.join(__dirname, "../public/products")));
    console.log(__dirname);
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