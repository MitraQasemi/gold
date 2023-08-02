const axios = require("axios");
const { ApiError } = require("../../api/middlewares/error");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getOneOrder = async (userId, orderId) => {
    try {
        const result = await prisma.order.findUnique({
            data: {
                id: orderId,
                userId: userId
            }
        })
        console.log(result);
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

module.exports = {
    getOneOrder
};
