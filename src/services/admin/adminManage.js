const {PrismaClient} = require("@prisma/client")

const bcrypt = require("bcrypt")

const prisma = new PrismaClient

// GET

const getAdmin = async (adminId) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: adminId
            }
        })

        if (!admin) {
            return "admin does not exist"
        }

        return admin;
    } catch (error) {
        throw error;
    }
}

// POST


const createAdmin = async (username, password, permissions) => {
    try {
        const result = await prisma.admin.findUnique({
            where: {
                username: username
            }
        })
        if (result) {
            return "this admin already exists"
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const permissionsString = JSON.stringify(permissions);

        const admin = await prisma.admin.create({
            data: {
                username,
                password:hashedPassword,
                permissions:permissionsString
            }
        });

        return admin;
    } catch (error) {
        throw error;
    }
}

// PUT

const editAdmin = async (adminId, newDetails) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: adminId
            }
        })
        if (!admin) {
            return "user is not exist";
        }

        const {password} = newDetails;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            newDetails.password = hashedPassword
        }
        const {permissions} = newDetails;
        if (permissions) {
            const permissionsString = JSON.stringify(permissions);
            newDetails.permissions = permissionsString;
        }
        const updatedAdmin = await prisma.admin.update({
            where: {
                id: adminId
            }, data: newDetails
        })

        return updatedAdmin
    } catch (error) {
        throw error;
    }
}

module.exports = {getAdmin, createAdmin, editAdmin}