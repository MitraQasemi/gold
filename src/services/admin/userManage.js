const { PrismaClient } = require("@prisma/client")

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
      return "user is not exist"
    }

    return user;
  } catch (error) {
    throw error;
  }
}

// POST

const createUser = async (userDetails) => {
  try {
    const { phoneNumber, password } = userDetails;
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
      return "user is not exist";
    }
    const { password } = newDetails;
    const hashedPassword = await bcrypt.hash(password, 10);
    newDetails.password = hashedPassword
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: newDetails
    })

    return updatedUser
  } catch (error) {
    throw error;
  }
}

// DELETE

const deleteUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return "user not exist"
    }

    const result = await prisma.user.delete({
      where: {
        id: userId
      }
    })

    return result
  } catch (error) {
    throw error
  }
}

module.exports = {
  getUser,
  createUser,
  editUser,
  deleteUser
}