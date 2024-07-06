const bcrypt = require("bcryptjs");
const {v4: uuidv4} = require("uuid");
const path = require('path');
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: path.resolve(`${__dirname}`,"../",".env")
})
const generatorsId = ()=>{
    return uuidv4();
}
const removeStorage = (filename)=>{
    if(typeof filename !== "string"){
        return false;
    }
    if(filename.length === 0){
        return false;
    }
    const pathStorage = path.resolve(`${__dirname}/`,"../","storage/",`${filename}`);
    if(fs.existsSync(pathStorage)){
        fs.unlinkSync(pathStorage);
        return true;
    }   
    return false;
}
const generatePassword = (password)=>{
    if(typeof password === "string"){
      let salt =bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);
      return hash;
    }else{
      throw new Error("El argumento para generar cifrado de contrasena debe ser un String");
    }
  }

const comparePassword = (textPlainPassword, hashPassword)=>{
    if(typeof textPlainPassword === "string" && typeof hashPassword === "string"){
      return bcrypt.compareSync(textPlainPassword, hashPassword);
    }else{
      throw new Error("Los argumentos para comprar contrasenas deben ser strings ");
    } 
  }
const sign = (dataJson)=>{
    return jwt.sign(dataJson, process.env.SECRET_PRIVATE_KEY,{
        expiresIn: "2h"
    });
}
const verify = (token)=>{
    return jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
}
module.exports = {generatorsId, removeStorage, sign, verify, generatePassword, comparePassword}