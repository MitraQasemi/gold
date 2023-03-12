const { PrismaClient } = require(".prisma/client");

const prisma = new PrismaClient

module.exports = async (req, res, next) => {
  const admin = await prisma.admin.findUnique({
    where: {
      username: req.admin.username
    }
  })

  if (!admin) {
    return res.status(404).send("admin not found")
  }

  req.admin = admin

  return next()
}