const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
let newArrayFiles = [];
const arrayFiles = fs.readdirSync(path.resolve(__dirname));
newArrayFiles = arrayFiles.map(value=>value.split(".")[0]);
newArrayFiles.forEach(element => {
    if(element !== "main"){
        router.use(`/${element}`, require(path.resolve(__dirname,`${element}`)));
    }
});

module.exports = router;