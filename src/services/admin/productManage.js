const { PrismaClient } = require("@prisma/client");
const { ApiError } = require("../../api/middlewares/error");
const { number, boolean } = require("joi");
const { query } = require("express");
const { attachPriceToProduct }=require("../user/attachPrice")

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
        throw new ApiError(error.statusCode, error.message);
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
        throw new ApiError(error.statusCode, error.message);
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
        throw new ApiError(error.statusCode, error.message);
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
        throw new ApiError(error.statusCode, error.message);
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
        throw new ApiError(error.statusCode, error.message);
    }
}



const filter = async (queryObject) => {
    try {
        let query = {
            pipeline: []
        }

        if (queryObject) {
            //امکان خرید قسطی
            if (queryObject.installment) {
                if (queryObject.installment === "true") {
                    queryObject.installment = true
                } else {
                    queryObject.installment = false
                }
                query.pipeline.push({ $match: { 'installment.available': queryObject.installment } })
            }
            //دسته بندی
            if (queryObject.cat) {
                query.pipeline.push({ $match: { "category": { $regex: queryObject.cat } } })
            }
            //محدوده وزن
            if (queryObject.weight) {
                let weight = queryObject.weight.split(",");
                query.pipeline.push({
                    $match: {
                        $and: [
                            { "weight": { $gte: Number(weight[0]) } },
                            { "weight": { $lte: Number(weight[1]) } }
                        ]

                    }
                })
            }
            //عیار
            if (queryObject.weightUnit) {
                query.pipeline.push({ $match: { "weightUnit": { $regex: queryObject.weightUnit } } })
            }
            //رنگ
            if (queryObject.color) {
                query.pipeline.push({ $match: { "metaData": { $elemMatch: { "property": "color", "value": queryObject.color } } } })
            }

            //جدید ترین ها
            if (queryObject.newest) {
                query.pipeline.push({ $sort: { "date": -1 } })
            }
            //پرفروش ترین ها
            if (queryObject.sell) {
                query.pipeline.push({ $sort: { "sellQuantity": -1 } })
            }
            //ارزان ترین
            if (queryObject.cheapest) {
                query.pipeline.push({ $sort: { "weight": 1 } })
            }
            if (queryObject.size) {
                skip = Number(queryObject.size * (queryObject.page - 1)) | 0;
                limit = Number(queryObject.size);
                query.pipeline.push({ $skip: skip });
                query.pipeline.push({ $limit: limit });
            }

        }
        const selectFields = {
            _id: 1,
            title:1,
            thumbnailImage:1,
            wage:1,
            profitPercentage:1,
            weight:1,
            weightUnit:1,
            discount:1    
        };

        query.pipeline.push({ $project: selectFields });

        let result = await prisma.product.aggregateRaw(query)
        const keysToRemove = ["$skip", "$limit"];
        result = await attachPriceToProduct(result)
        query.pipeline = query.pipeline.filter((obj) => {
            const keys = Object.keys(obj);
            return !keys.some((key) => keysToRemove.includes(key));
        });
        if (result.length === 0) {
            return { result: result, count: 0 };
        }
        query.pipeline.push({ $count: "totalNewestProducts" })

        const count = await prisma.product.aggregateRaw(query)
        return { result: result, count: count[0].totalNewestProducts };
    } catch (error) {
        throw new ApiError(error.statusCode, error.message);
    }
}

module.exports = { getOneProduct, getManyProducts, createProduct, editProduct, deleteProduct, filter }
