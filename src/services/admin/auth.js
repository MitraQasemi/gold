const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const {PrismaClient} = require('@prisma/client')
require("dotenv").config({path: "../.env"});

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
            return "this admin already exists";
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const permissionsString = JSON.stringify(permissions)
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
            , {expiresIn: 3600000})
        const refreshToken = JWT.sign({
                id: foundAdmin.id,
            }, process.env.JWT_SECRET_REFRESH
            , {expiresIn: 3600000 * 1000})

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
        throw error;
    }
}

const adminLogin = async (admin) => {
    try {
        const {username, password} = admin;
        const foundedUser = await prisma.admin.findUnique({
            where: {
                username: username,
            }
        })

        if (!foundedUser) {
            return "this admin does not exist";
        }
        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch) {
            return "wrong password ";
        }

        const accessToken = JWT.sign({
                id: foundedUser.id,
            }, process.env.JWT_SECRET_ACCESS
            , {expiresIn: 3600000})
        const refreshToken = JWT.sign({
                id: foundedUser.id,
            }, process.env.JWT_SECRET_REFRESH
            , {expiresIn: 3600000 * 1000})

        await prisma.admin.update({
            where: {
                id: foundedUser.id,
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

const adminLogout = async (user) => {
    try {
        const {id} = user;
        await prisma.Admin.update({
            where: {
                id: id
            },
            data: {
                refreshToken:""
            }
        })
        return "loged out"

    } catch (error) {
        throw error;
    }
}
module.exports = {adminSignup, adminLogin, adminLogout};