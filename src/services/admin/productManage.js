const { PrismaClient } = require("@prisma/client");
const { ApiError } = require("../../api/middlewares/error")

const prisma = new PrismaClient

// GET One

const getOneProduct = async (productId) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        if (product)
            return product;
        throw new ApiError(404, "this product does not exist")
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

// GET Many

const getManyProducts = async (queryObject) => {
    try {
        const query = {}
        if (queryObject) {
            if (queryObject.cat) {
                query.where.category = {
                    startsWith: queryObject.cat
                }
            }
            if (queryObject.tag) {
                query.where.tags = {
                    hasEvery: JSON.parse(queryObject.tag)
                }
            }
            if (queryObject.size) {
                query.skip = Number(queryObject.size * (queryObject.page - 1)) | 0;
                query.take = Number(queryObject.size);
            }
        }
        const result = await prisma.product.findMany(query)
        delete query.skip;
        delete query.take;
        const count = await prisma.product.count(query);
        return { result: result, count: count };
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

// POST

const createProduct = async (productDetails) => {
    try {
        const result = await prisma.product.create({
            data: productDetails
        })
        return result
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

// PUT

const editProduct = async (productId, data) => {
    try {
        const result = await prisma.product.update({
            where: {
                id: productId
            },
            data: data
        })
        return result
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}

// DELETE

const deleteProduct = async (productId) => {
    try {
        const result = prisma.product.delete({
            where: {
                id: productId
            }
        })
        return result;
    } catch (error) {
        throw new ApiError(500, error.message);
    }
}



module.exports = { getOneProduct, getManyProducts, createProduct, editProduct, deleteProduct }
