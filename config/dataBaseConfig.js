const path = require("path");
require("dotenv").config({
    path: path.resolve(`${__dirname}`, "../",".env")
});

const config = {
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.DB_PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}

module.exports = config;