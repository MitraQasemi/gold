const JWT = require("jsonwebtoken");

require("dotenv").config({path: "../.env"});

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const AdminRefreshToken = async (token) => {
    try {
        let user = await JWT.verify(token, process.env.JWT_SECRET_REFRESH);
        const id = user.id;
        const result = await prisma.admin.findUnique({
            where: {
                id: id
            }
        })
        if (!result) {
            return "this refresh token is not valid"
        }
        if (result.refreshToken === token) {

            const accessToken = await JWT.sign({
                    id: id
                }, process.env.JWT_SECRET_ACCESS
                , {expiresIn: 3600000})
            return accessToken;
        } else {
            return "refresh token did not match"
        }

    } catch (error) {
        throw error;
    }
}

const UserRefreshToken = async (token) => {
    try {
        let user = await JWT.verify(token, process.env.JWT_SECRET_REFRESH);
        const id = user.id;
        const result = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!result) {
            return "this refresh token is not valid"
        }
        if (result.refreshToken === token) {

            const accessToken = await JWT.sign({
                    id: id
                }, process.env.JWT_SECRET_ACCESS
                , {expiresIn: 3600000})
            return accessToken;
        } else {
            return "refresh token did not match"
        }

    } catch (error) {
        throw error;
    }
}
module.exports = {AdminRefreshToken, UserRefreshToken};