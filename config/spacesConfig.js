const path = require("path");
require("dotenv").config({
    path: path.resolve(`${__dirname}/`,"../",".env")
})

const s3ClientConfig = {
    endpoint: process.env.ENDPOINT,
    forcePathStyle: false,
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY
    }
}

module.exports = s3ClientConfig;