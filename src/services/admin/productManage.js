const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient

// GET One

const getOneProduct = async (productId) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    return product;
}

// GET Many

const getManyProducts = async (queryObject) => {
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
            query.skip = Number(queryObject.size *( queryObject.page-1)) | 0;
            query.take = Number(queryObject.size);
        }
    }
    const result = await prisma.product.findMany(query)
    delete query.skip;
    delete query.take;
    const count = await prisma.product.count(query);
    return {result: result, count: count};
}

// POST

const createProduct = async (productDetails) => {
    const result = await prisma.product.create({
        data: productDetails
    })
    return result
}

// PUT

const editProduct = async (productId, data) => {
    const result = await prisma.product.update({
        where: {
            id: productId
        },
        data: data
    })
    return result
}

// DELETE

const deleteProduct = async (productId) => {
    const result = prisma.product.delete({
        where: {
            id: productId
        }
    })
    return result;
}

module.exports = {
    getOneProduct,
    getManyProducts,
    createProduct,
    editProduct,
    deleteProduct
}
