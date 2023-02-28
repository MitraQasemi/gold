const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client')
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()

const signup = async (user) => {
    try {
        const { username, password } = user;
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
                refreshToken
            },
        })

        return accessToken;
    } catch (error) {
        throw error;
    }
}

const login = async (user) => {
    try {
        const {username, password} = user;
        const foundedUser = await prisma.admin.findUnique({
            where: {
                username: username, 
            }
        })
        console.log(foundedUser)

        if (!foundedUser) {
            return "this user does not exist";
        }
        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch) {
            return "wrong password ";
        }
    } catch (error) {
        throw error;
    }
}
module.exports = { signup, login };