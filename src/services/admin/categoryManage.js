const { PrismaClient } = require("@prisma/client")
const { ApiError } = require("../../api/middlewares/error")

const prisma = new PrismaClient()

const getOneCategory = async (categoryId) => {
    try {
        const result = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })
        if (result)
            return result;
        throw new ApiError(404, "!این دسته بندی در سیستم وجود ندارد")
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const getManyCategories = async (queryObject) => {
    try {
        const query = {}
        if (queryObject) {
            if (queryObject.size) {
                query.skip = Number(queryObject.size * (queryObject.page - 1)) | 0;
                query.take = Number(queryObject.size);
            }
        }
        const result = await prisma.category.findMany(query)
        const count = await prisma.category.count();
        return { result: result, count: count };
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }

}

const createCategory = async (categoryDetails) => {
    try {
        const foundedCategory = await prisma.category.findUnique({
            where: {
                category: categoryDetails.parent
            }
        })

        if (foundedCategory || categoryDetails.parent === "/") {
            const result = await prisma.category.create({
                data: categoryDetails
            })
            return result;
        }
        throw new ApiError(404, "!سر دسته ای که انتخاب کرده اید در سیستم وجود ندارد")

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const result = await prisma.category.delete({
            where: {
                id: categoryId
            }
        })
        return result;

    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }

}

module.exports = { getOneCategory, getManyCategories, createCategory, deleteCategory }