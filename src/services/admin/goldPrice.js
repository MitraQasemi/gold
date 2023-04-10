const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")

const prisma = new PrismaClient()

const goldPrice = async () => {
    try {

    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

module.exports = { goldPrice }