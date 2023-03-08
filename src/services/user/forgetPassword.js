const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const axios = require('axios');
const { Level } = require('level')

const db = new Level('./leveldb', { valueEncoding: 'json' })
const { PrismaClient } = require('@prisma/client');
require("dotenv").config({ path: "../.env" });

const prisma = new PrismaClient()


const forgetPassword = async (user) => {
    try {
        
    } catch (error) {
        throw error;
    }
}
module.exports = { forgetPassword };