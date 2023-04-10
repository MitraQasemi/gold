const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")

const prisma = new PrismaClient()

const createConfig = async (configDetails) => {
    try {
        console.log(configDetails);
        const result = await prisma.config.create({
            data: configDetails
        })
        return result;
    } catch (error) {
        throw new ApiError(500, error.message);
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
        throw new ApiError(500, error.message);
    }
}
module.exports = { createConfig, editConfig }