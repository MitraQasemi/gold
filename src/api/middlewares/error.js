require("dotenv").config({ ath: "../.env" });

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const errorHandler = (err, req, res, next) => {
    let {
        statusCode,
        message
    } = err;

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.ENVIRONMENT === "development" && {
            stack: err.stack,
        }),
    };

    if (process.env.ENVIRONMENT === "development") {
        console.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = { errorHandler, ApiError }