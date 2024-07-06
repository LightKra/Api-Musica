const Joi = require("joi");

//funciones
const validationUrl = (url)=>{
    try{
        new URL(url);
        return true;
    }catch(error){
        return false;
    }
  }
  const validationProductionStatus = (NODE_ENV)=>{
    return NODE_ENV === "production";
  }
  const validationClass = (nameClass, classInstance)=>{
    try{
      if(!classInstance){
          return false;
      }
      return classInstance.constructor.name === nameClass;
    }catch(error){
      return false;
    }
  }
  const validationStringId = (dataString)=>{
    const schema = Joi.string().min(20).max(50);
    const {error} = schema.validate(dataString);
    if(error){
      return false;
    }else{
      return true;
    }
  }

module.exports = {validationClass, validationUrl, validationProductionStatus, validationStringId}