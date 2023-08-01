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
        return next (new ApiError(404, "مدیر یافت نشد "));
    }

    req.admin = admin
    return next()
}