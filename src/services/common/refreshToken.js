const JWT = require("jsonwebtoken");
const { ApiError } = require("../../api/middlewares/error")

require("dotenv").config({ path: "../.env" });

const { PrismaClient } = require('@prisma/client');
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
        if (!result?.id) {
            throw new ApiError(413, "!توکن اشتباه است");
        }
        if (result.refreshToken === token) {

            const accessToken = await JWT.sign({
                id: id
            }, process.env.JWT_SECRET_ACCESS
                , { expiresIn: 3600000 })

            const refreshToken = await JWT.sign({
                id: id
            }, process.env.JWT_SECRET_REFRESH
                , { expiresIn: 3600000 * 1000 })

            await prisma.Admin.update({
                where: {
                    id: id
                },
                data: {
                    refreshToken: refreshToken
                }
            })
            return { accessToken: accessToken, refreshToken: refreshToken };
        } else {
            throw new ApiError(413, "!توکن اشتباه است");
        }

    } catch (error) {
        throw new ApiError(500, error.message);
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
        if (result) {
            if (result.blocked) {
                throw new ApiError(403, "!کاربر مورد نظر مسدود است ");
            }
        }
        if (!result?.id) {
            throw new ApiError(413, "!توکن اشتباه است");
        }
        if (result.refreshToken === token) {

            const accessToken = await JWT.sign({
                id: id
            }, process.env.JWT_SECRET_ACCESS
                , { expiresIn: 3600000 })
            const refreshToken = await JWT.sign({
                id: id
            }, process.env.JWT_SECRET_REFRESH
                , { expiresIn: 3600000 * 1000 })

            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    refreshToken: refreshToken
                }
            })
            return { accessToken: accessToken, refreshToken: refreshToken };
        } else {
            throw new ApiError(413, "!توکن اشتباه است");
        }

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}
module.exports = { AdminRefreshToken, UserRefreshToken };