const {PrismaClient} = require(".prisma/client");
const { ApiError } = require("./error");
const prisma = new PrismaClient

module.exports = async (req, res, next) => {
    const admin = await prisma.admin.findUnique({
        where: {
            id: req.user.id
        }
    })
    if (!admin) {
        throw new ApiError(404, "this admin does not exist")
    }

    req.admin = admin

    return next()
}