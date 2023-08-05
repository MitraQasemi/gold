const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")
const axios = require('axios');
const moment = require("jalali-moment");
moment.locale("fa");
const prisma = new PrismaClient()

const goldPrice = async () => {
    try {
        return await axios.get('https://api.tgju.org/v1/widget/tmp?keys=137121,137122').then(async response => {
            const result = response.data.response.indicators;
            const data = {
                buyQuotation: Number(result[0].p )+150000,
                sellQuotation: Number(result[0].p),
                geram18: Number(result[0].p),
                geram24: Number(result[1].p)
            }
            await prisma.goldPrice.create({
                data: data
            })
            console.log("!قیمت طلا بروزرسانی شد\n");
            return data;
        }).catch(error => {
            // throw new ApiError(error.statusCode, error.message);
            console.log(error.statusCode, error.message);
        });
    } catch (error) {
        console.log(error);
        // throw new ApiError(error.statusCode, error.message);
    }
}

module.exports = { goldPrice }