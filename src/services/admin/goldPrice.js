const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")
const axios = require('axios');
const moment = require("jalali-moment");
moment.locale("fa");
const prisma = new PrismaClient()

const goldPrice = async () => {
    try {
        let response = axios.get("https://api.tgju.org/v1/widget/tmp?keys=137121,137122,137120,137138,137137,137139,137142,137140").then((response) => {
            console.log(response.data.response);
            //return response.data;
        }).catch(error => {
            console.log(error);
            throw new ApiError(500, error.message);
        });
        // await prisma.goldPrice.create({
        //     data: data
        // })
        // console.log("gold price updated\n");
        // return data;


    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

module.exports = { goldPrice }