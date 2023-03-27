const {PrismaClient} = require(".prisma/client");

const prisma = new PrismaClient

module.exports = async (req, res, next) => {
    const admin = await prisma.admin.findUnique({
        where: {
            id: req.user.id
        }
    })
    console.log(admin);
    if (!admin) {
        return res.status(404).send("admin not found")
    }

    req.admin = admin

    return next()
}