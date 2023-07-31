const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const axios = require('axios');
const SData = require('simple-data-storage');
const { ApiError } = require("../../api/middlewares/error")
const { PrismaClient } = require('@prisma/client');
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()

const userSignup = async (phoneNumber) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        })
        if (result) {
            throw new ApiError(403, "this user already exists");
        }

        const code = Math.floor(Math.random() * (99999 - 9999)) + 9999;

        await SData(phoneNumber, { code: code, time: Date.now() })

        const apiKey = "627269524D4A464252476F584B6264684A4D6B6A57387654343461645A713644344C7348674A67567943513D"
        const template = "MicroLearning"
        const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${code}&template=${template}`

        return axios.get(url).then(response => {
            return {result:"code sent"};
        }).catch(error => {
            throw new ApiError(500, error.message);
        });

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const userLogin = async (phoneNumber, password) => {
    try {
        const foundedUser = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        })
        if (foundedUser) {
            if (foundedUser.blocked) {
                throw new ApiError(403, "this user is blocked");
            }
        }else{
            throw new ApiError(404, "wrong password or username");
        }

        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch) {
            throw new ApiError(403, "wrong password or username")
        }

        const accessToken = JWT.sign({
            id: foundedUser.id,
        }, process.env.JWT_SECRET_ACCESS
            , { expiresIn: 3600000 })
        const refreshToken = JWT.sign({
            id: foundedUser.id,
        }, process.env.JWT_SECRET_REFRESH
            , { expiresIn: 3600000 * 1000 })

        await prisma.user.update({
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

const userSignupVerification = async (phoneNumber, code, password) => {
    try {
        const data = await SData(phoneNumber);
        if (data) {
            if (Date.now() - data.time > 120000) {
                SData.clear(phoneNumber);
                throw new ApiError(400, "verification failed");
            }
            if (data.code == code) {

                SData.clear(phoneNumber);

                const hashedPassword = await bcrypt.hash(password, 10);
                const result = await prisma.user.create({
                    data: {
                        phoneNumber,
                        password: hashedPassword
                    },
                })

                const accessToken = JWT.sign({
                    id: result.id,
                }, process.env.JWT_SECRET_ACCESS
                    , { expiresIn: 3600000 })
                const refreshToken = JWT.sign({
                    id: result.id,
                }, process.env.JWT_SECRET_REFRESH
                    , { expiresIn: 3600000 * 1000 })

                await prisma.User.update({
                    where: {
                        id: result.id
                    },
                    data: {
                        refreshToken
                    }
                })

                return { accessToken: accessToken, refreshToken: refreshToken };
            } else {
                throw new ApiError(400, "verification failed");
            }
        } else {
            throw new ApiError(400, "verification failed(undefined code)");
        }
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const userLogout = async (id) => {
    try {
        await prisma.User.update({
            where: {
                id: id
            },
            data: {
                refreshToken: ""
            }
        })
        return "loged out"

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}
module.exports = { userSignup, userLogin, userSignupVerification, userLogout };