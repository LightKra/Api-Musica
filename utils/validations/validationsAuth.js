const joi = require("joi");

const validationsLogin = (jsonLogin)=>{
    if(!jsonLogin){
        return false;
    }
    const schema = joi.object({
        email_user: joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"))
                    .required(),
        password_user: joi.string()
                        .min(3)
                        .max(50)
                        .required()

    });
    const {error} = schema.validate(jsonLogin);
    if( typeof error === "undefined"){
        return true;
    }
    return false;
}

module.exports = {validationsLogin}