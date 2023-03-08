const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const axios = require('axios');
const { Level } = require('level')

const db = new Level('./leveldb', { valueEncoding: 'json' })
const { PrismaClient } = require('@prisma/client');
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()


const forgetPassword = async (user) => {
    try {
        const { phoneNumber } = user;
        const result = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        })

        if (!result) {
            return "this user does not exists";
        }

        const code = Math.floor(Math.random() * (99999 - 9999)) + 9999;
        await db.put(phoneNumber, { code: code, time: Date.now() })

        const apiKey = "627269524D4A464252476F584B6264684A4D6B6A57387654343461645A713644344C7348674A67567943513D"
        const template = "chalak"
        const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${code}&template=${template}`

        return axios.get(url).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error);
        });

    } catch (error) {
        throw error;
    }
}

const forgetPasswordVerification = async (user) => {
    try {
        const { phoneNumber, code, password } = user;
        const data = await db.get(phoneNumber);

        if (Date.now() - data.time > 120000) {
            db.del(phoneNumber);
            return "verification failed"
        }

        if (data.code == code) {

            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: {
                    phoneNumber: phoneNumber,
                },
                data: {
                    password: hashedPassword,
                },
            })
            return "password changed";
        } else {
            return "verification failed"
        }
    } catch (error) {
        throw error;
    }
}
module.exports = { forgetPassword ,forgetPasswordVerification};