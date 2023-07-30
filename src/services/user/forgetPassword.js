const bcrypt = require("bcrypt");
const axios = require('axios');
const SData = require('simple-data-storage');
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require('@prisma/client');
const JWT = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()


const forgetPassword = async (phoneNumber) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        })

        if (result) {
            if (result.blocked) {
                throw new ApiError(403, "this user is blocked");
            }
        }else{
            throw new ApiError(404, "this user does not exist");
        }

        const code = Math.floor(Math.random() * (99999 - 9999)) + 9999;
        await SData(phoneNumber, { code: code, time: Date.now() })

        const apiKey = "627269524D4A464252476F584B6264684A4D6B6A57387654343461645A713644344C7348674A67567943513D"
        const template = "chalak"
        const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${code}&template=${template}`

        return axios.get(url).then(response => {
            return response.data;
        }).catch(error => {
            throw new ApiError(500, error.message);
        });

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const forgetPasswordVerification = async (phoneNumber, code, password) => {
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

                const result = await prisma.user.findUnique({
                    where: {
                        phoneNumber: phoneNumber
                    }
                })
                const accessToken = JWT.sign({
                    id: result.id,
                }, process.env.JWT_SECRET_ACCESS
                    , { expiresIn: 3600000 })
                const refreshToken = JWT.sign({
                    id: result.id,
                }, process.env.JWT_SECRET_REFRESH
                    , { expiresIn: 3600000 * 1000 })

                await prisma.user.update({
                    where: {
                        phoneNumber: phoneNumber,
                    },
                    data: {
                        password: hashedPassword,
                        refreshToken: refreshToken
                    },
                })

                return { accessToken: accessToken };
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
module.exports = { forgetPassword, forgetPasswordVerification };