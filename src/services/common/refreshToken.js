const JWT = require("jsonwebtoken");

const {PrismaClient} = require('@prisma/client');
require("dotenv").config({path: "../.env"});

const prisma = new PrismaClient()

const refreshToken = async (token) => {
    try {
        let user = await JWT.verify(token, process.env.JWT_SECRET_REFRESH);
        const id = user.id;
        const accessToken = await JWT.sign({
                id: id
            }, process.env.JWT_SECRET_ACCESS
            , {expiresIn: 3600000})

        return accessToken;
    } catch (error) {
        throw error;
    }
}


module.exports = {refreshToken};