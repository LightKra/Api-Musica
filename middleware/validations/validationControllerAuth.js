const {validationsLogin} = require("../../utils/validations/validationsAuth");

const validationControllerAuthPost = (req, res, next)=>{
    try{
        const jsonLogin = req.body;
        if(!validationsLogin(jsonLogin)){
            return res.status(400).json({message: "Datos no validos", result: [false]});
        }
        next();
    }catch(error){
        res.status(500).json({message: "Error al validar datos de sesion", result: [{error: error.message}]});
    }
}

module.exports = {validationControllerAuthPost}