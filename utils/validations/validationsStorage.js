const {validationUrl} = require("../validations/validations");
const joi = require("joi");
/**
 * funcion para validar los datos de storage
 * @param {*} jsonStorage 
 * @returns boolean
 */
const validationsStorageJson = (jsonStorage)=>{
    if(!jsonStorage){
        return false;
    }
    const schema = joi.object({
        id_storage: joi.string()
                        .min(20)
                        .max(50)
                        .required(),
        url_storage: joi.string()
                        .required(),
        filename_storage: joi.string()
                        .required()
    });
    if(!validationUrl(jsonStorage.url_storage)){
        return false;
    }
    const {error} = schema.validate(jsonStorage);
    if(typeof error === "undefined"){
        return true;
    }
    return false;
}

module.exports = {validationsStorageJson}