const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const getOneCategory = async (categoryId) => {
    const result = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })
    if(result)
    return result;
    throw new Error("not found")
}

const getManyCategories = async (queryObject) => {
    const query = {}
    if (queryObject) {
        if (queryObject.size) {
            query.skip = Number(queryObject.size * queryObject.page) | 0;
            query.take = Number(queryObject.size);
        }
    }
    const result = await prisma.category.findMany(query)
    return result;
}

const createCategory = async (categoryDetails) => {
    const result = await prisma.category.create({
        data: categoryDetails
    })
    return result;
}

const deleteCategory = async (categoryId) => {
    const result = await prisma.category.delete({
        where: {
            id: categoryId
        }
    })

    return result;
}

module.exports = {
    getOneCategory,
    getManyCategories,
    createCategory,
    deleteCategory
}