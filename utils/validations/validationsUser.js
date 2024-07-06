const joi = require("joi");
/**
 * funcion para la validacion de datos del usurio.
 * @param {*} jsonUser 
 * @returns boolean
 */
const validationsUserJson = (jsonUser)=>{
    if(!jsonUser){
        return false;
    }
    const schema = joi.object({
        id_usuario: joi.string()
                    .min(20)
                    .max(50)
                    .required(),
        name_user: joi.string()
                    .alphanum()
                    .min(3)
                    .max(70)
                    .required(),
        age_user: joi.number()
                    .integer()
                    .min(1)
                    .max(200)
                    .required(),
        email_user: joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                    .required(),
        password_user: joi.string()
                        .min(60)
                        .max(70)
                        .required(),
        role_user: joi.string()
                    .alphanum()
                    .min(3)
                    .max(20)
                    .required(),
    });
    const {error} = schema.validate(jsonUser);
    if( typeof error === "undefined"){
        return true;
    }
    return false;
}

module.exports = {validationsUserJson}