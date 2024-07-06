const UserService = require("../services/userServices");
const User = require("../models/user");
const {sign} = require("../utils/utils");
const {comparePassword} = require("../utils/utils");

class Auth{

    static userRegister = async (req, res)=>{
        try{
            const userJson = req.body;
            const user = new User(userJson);
            const userService = new UserService();
            await userService.save(user);
            const token = sign({id_usuario: userJson.id_usuario});
            const {password_user, ...data} = userJson;
            res.status(200).json({message: "Datos registrados", result: [{token}, data]});
        }catch(error){
            res.status(500).json({message: "Datos No Validos", result: [{error: error.message}]});
        }
    }
    
    static userLogin = async (req, res)=>{
        try{
            const email_user = req.body.email_user;
            const textPlainPassword = req.body.password_user;
            const userService = new UserService();
            const {rows, fields} = await userService.findEmail(email_user);
            if(!Array.isArray(rows)){
                return res.status(400).json({message: "El email no esta registrado", result: [false]});
            }
            if(rows.length === 0){
                return res.status(400).json({message: "El email no esta registrado", result: [false]});
            }
            const passwordHash = rows[0].password_user;
            const status = comparePassword(textPlainPassword, passwordHash);
            if(!status){
                return res.status(400).json({message: "El email o contrasena son incorrentos", result: [false]});
            }
            const token = sign({id_usuario: rows[0].id_user});
            const {password_user, ...data} = rows[0];
            res.status(200).json({message: "Login correcto", result: [{token, data}]});
        }catch(error){
            res.status(500).json({message: "Error al iniciar sesion", result: [{error: error.message}]});
        }
    }
}



module.exports = Auth;