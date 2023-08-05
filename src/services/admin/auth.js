const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client')
const { ApiError } = require("../../api/middlewares/error")

require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()

const adminSignup = async (username, password, permissions) => {
    try {
        const result = await prisma.admin.findUnique({
            where: {
                username: username,
            }
        })

        if (result) {
            throw new ApiError(403, " !این مدیر در سیستم وجود دارد ")
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const permissionsString = JSON.stringify(permissions);
        const foundAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                permissions: permissionsString
            },
        })
        const accessToken = JWT.sign({
            id: foundAdmin.id,
        }, process.env.JWT_SECRET_ACCESS
            , { expiresIn: 3600000 })
        const refreshToken = JWT.sign({
            id: foundAdmin.id,
        }, process.env.JWT_SECRET_REFRESH
            , { expiresIn: 3600000 * 1000 })

        await prisma.admin.update({
            where: {
                id: foundAdmin.id
            },
            data: {
                refreshToken
            }
        })

        return accessToken;
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const adminLogin = async (username, password) => {
    try {
        const foundedUser = await prisma.admin.findUnique({
            where: {
                username: username,
            }
        })

        if (!foundedUser) {
            throw new ApiError(404, " !نام کاربری یا رمز عبور اشتباه است")
        }
        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch) {
            throw new ApiError(403, " !نام کاربری یا رمز عبور اشتباه است")
        }

        const accessToken = JWT.sign({
            id: foundedUser.id,
        }, process.env.JWT_SECRET_ACCESS
            , { expiresIn: 3600000 })
        const refreshToken = JWT.sign({
            id: foundedUser.id,
        }, process.env.JWT_SECRET_REFRESH
            , { expiresIn: 3600000 * 1000 })

        await prisma.admin.update({
            where: {
                id: foundedUser.id,
            },
            data: {
                refreshToken: refreshToken,
            },
        })
        return { accessToken: accessToken, refreshToken: refreshToken };
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const adminLogout = async (id) => {
    try {
        await prisma.Admin.update({
            where: {
                id: id
            },
            data: {
                refreshToken: ""
            }
        })
        return " !مدیر  از سیستم خارج شد "

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}
module.exports = { adminSignup, adminLogin, adminLogout };