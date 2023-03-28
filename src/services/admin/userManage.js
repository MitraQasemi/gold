const {PrismaClient} = require("@prisma/client")

const bcrypt = require("bcrypt")

const prisma = new PrismaClient

// GET

const getUser = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return "user does not exist"
        }

        return user;
    } catch (error) {
        throw error;
    }
}

const getManyUser = async (queryObject) => {
    const query = {}
    if (queryObject) {
        if (queryObject.size) {
            query.skip = Number(queryObject.size *( queryObject.page-1)) | 0;
            query.take = Number(queryObject.size);
        }
    }
    const result = await prisma.user.findMany(query)
    const count = await prisma.user.count();
    return {result: result, count: count};
}
// POST

const createUser = async (userDetails) => {
    try {
        const {phoneNumber, password} = userDetails;
        const result = await prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber
            }
        })

        if (result) {
            return "this user already exists";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        userDetails.password = hashedPassword
        const user = await prisma.user.create({
            data: userDetails
        });

        return user;
    } catch (error) {
        throw error;
    }
}

// PUT

const editUser = async (userId, newDetails) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return "user does not exist";
        }
        const {password} = newDetails;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            newDetails.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            }, data: newDetails
        })

        return updatedUser
    } catch (error) {
        throw error;
    }
}

module.exports = {getUser, createUser, editUser, getManyUser}