const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client')
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()

const adminSignup = async (admin) => {
    try {
        const { username, password, permissions } = admin;
        const result = await prisma.admin.findUnique({
            where: {
                username: username,
            }
        })

        if (result) {
            return "this user already exists";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const accessToken = JWT.sign({
            username,
        }, process.env.JWT_SECRET_ACCESS
            , { expiresIn: 3600000 })
        const refreshToken = JWT.sign({
            username,
        }, process.env.JWT_SECRET_REFRESH
            , { expiresIn: 3600000 * 1000 })

        await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                permissions,
                refreshToken
            },
        })

        return accessToken;
    } catch (error) {
        throw error;
    }
}

const adminLogin = async (admin) => {
    try {
        const { username, password } = admin;
        const foundedUser = await prisma.admin.findUnique({
            where: {
                username: username,
            }
        })

        if (!foundedUser) {
            return "this user does not exist";
        }
        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch) {
            return "wrong password ";
        }

        const accessToken = JWT.sign({
            username,
        }, process.env.JWT_SECRET_ACCESS
            , { expiresIn: 3600000 })
        const refreshToken = JWT.sign({
            username,
        }, process.env.JWT_SECRET_REFRESH
            , { expiresIn: 3600000 * 1000 })

        await prisma.admin.update({
            where: {
                username: username,
            },
            data: {
                refreshToken: refreshToken,
            },
        })
        return accessToken;
    } catch (error) {
        throw error;
    }
}
module.exports = { adminSignup, adminLogin };