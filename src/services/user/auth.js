const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const axios = require('axios');
const { Level } = require('level')

const db = new Level('./leveldb', { valueEncoding: 'json' })
const { PrismaClient } = require('@prisma/client');
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()

const userSignup = async (user) => {
    try {
        const { phoneNumber } = user;
        const result = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber,
            }
        })
        if (result) {
            return "this user already exists";
        }

        const date = new Date();
        date.toString();

        const code = Math.floor(Math.random() * (99999 - 9999)) + 9999;
        await db.put(phoneNumber, { code: code, time: date })

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

const userLogin = async (user) => {
    try {

    } catch (error) {
        throw error;
    }
}

const userSignupVerification = async (user) => {
    try {
        const { phoneNumber, code } = user;
        const data = await db.get(phoneNumber);

        const dateNow = new Date();
        dateNow.toString();

        const date1 = data.time.split(":");
        const date2 = dateNow.split(":");
        

        if (date2[2] - date1[2] > 2 || date2[2] - date1[2] < 2 ) {
3
        }
        if (data.code == code) {

        } else {
            return "verification failed"
        }
    } catch (error) {
        throw error;
    }
}
module.exports = { userSignup, userLogin, userSignupVerification };