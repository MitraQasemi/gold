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
            query.skip = Number(queryObject.size *( queryObject.page-1)) | 0;
            query.take = Number(queryObject.size);
        }
    }
    const result = await prisma.category.findMany(query)
    const count = await prisma.category.count();
    return {result: result, count: count};
}

const createCategory = async (categoryDetails) => {
    const foundedCategory = await prisma.category.findUnique({
        where : {
            category : categoryDetails.parent
        }
    })

    if (foundedCategory || categoryDetails.parent === "/"){
        const result = await prisma.category.create({
            data: categoryDetails
        })
        return result;
    }
    return "this parent does not exist"
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