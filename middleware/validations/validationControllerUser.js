
const {generatorsId} = require("../../utils/utils");
const {validationsUserJson} = require("../../utils/validations/validationsUser");
const {generatePassword, comparePassword} = require("../../utils/utils");
const UserService = require("../../services/userServices");

const validationControllerUserPost = (req, res, next)=>{
    try{
        const jsonUser = req.body;
        jsonUser.id_usuario = generatorsId();
        if(typeof jsonUser.age_user === "string"){
            if(jsonUser.age_user.trim() !== ""){
                jsonUser.age_user = Number(jsonUser.age_user);
            }
        }
        jsonUser.role_user = "user";
        jsonUser.password_user = generatePassword(jsonUser.password_user);
        if(!validationsUserJson(jsonUser)){
            return res.status(400).json({message: "Datos no validos", result: [false]});
        }
        req.body = jsonUser;
        next();
    }catch(error){
        res.status(400).json({message: "Ocurrio un error inesperado", result: [{error: error.message}]});
    }
}

const validationControllerUserPut = async (req, res, next)=>{
    try{
        const jsonUser = req.body;
        const id = req.params.id
        if(typeof jsonUser.age_user === "string"){
            if(jsonUser.age_user.trim() !== ""){
                jsonUser.age_user = Number(jsonUser.age_user);
            }
        }
        jsonUser.id_usuario = id;
        jsonUser.password_user = generatePassword(jsonUser.password_user);
        if(!validationsUserJson(jsonUser)){
            return res.status(400).json({message: "Datos no validos", result: [false]});
        }
        //traer roles de la base de datos
        const userService = new UserService();
        const {rows, fields} = await userService.findId(id);
        if(!Array.isArray(rows)){
            return res.status(400).json({message: "Datos no validos", result: [false]});
        }
        if(rows.length === 0){
            return res.status(400).json({message: "Datos no validos", result: [false]});
        }
        jsonUser.role_user = rows[0].role_user;
        req.body = jsonUser;
        next();
    }catch(error){
        res.status(400).json({message: "Ocurrio un error inesperado", result: [{error: error.message}]});
    }
}

module.exports = {validationControllerUserPost, validationControllerUserPut}