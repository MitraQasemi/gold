const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")
const axios = require('axios');
const moment = require("jalali-moment");
moment.locale("fa");
const prisma = new PrismaClient()

const goldPrice = async () => {
    try {
        const data = {
            date: moment().toISOString(),
            buyQuotation: 1000,
            sellQuotation: 800
        }
        await prisma.goldPrice.create({
            data: data
        })
        return data;
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

module.exports = { goldPrice }