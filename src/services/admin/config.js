const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")

const prisma = new PrismaClient()

const createConfig = async (configDetails) => {
    try {
        const result = await prisma.config.create({
            data: configDetails
        })
        return result;
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const editConfig = async (configId, data) => {
    try {
        const result = await prisma.config.update({
            where: {
                id: configId
            },
            data: data
        })
        return result
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}
module.exports = { createConfig, editConfig }