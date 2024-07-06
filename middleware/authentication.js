const {verify} = require("../utils/utils");
const UserService = require("../services/userServices");

const authenticateJwt = async (req, res, next)=>{
    try{
        if(!req.headers.authorization){
            return res.status(400).json({message: "Token no existe", result: [false]});
        }
        const token = req.headers.authorization.split(" ").pop();
        const id_usuario = verify(token).id_usuario;
        const userService = new UserService();
        const {rows, fields} = await userService.findId(id_usuario);
        if(!Array.isArray(rows)){
            return res.status(400).json({message: "No existe el usuario", result: [false]});
        }
        if(rows.length === 0){
            return res.status(400).json({message: "No existe el usuario", result: [false]});
        }
        const data = {
            id_usuario: rows[0].id_user,
            name_user: rows[0].name_user,
            age_user: rows[0].age_user,
            email_user: rows[0].email_user,
            role_user: rows[0].role_user
        }
        req.user = data;
        next();
    }catch(error){
        res.status(500).json({message: "Error con la autenticacion", result: [{error: error.message}]});
    }
}

const authorizeRole = (roles)=> (req, res, next)=>{
    try{
       const user = req.user;
       if(!user){
        throw new Error("No existe el usuario, para identificar rol");
       }
       if(!Array.isArray(roles)){
        throw new Error("La variable roles debe ser un array");
       }
       if(!roles.includes(user.role_user.toLowerCase())){
        return res.status(400).json({message: "No tienes permisos", result: [false]});
       }
       next();
    }catch(error){
        res.status(500).json({message: "Algo salio mal con los roles", result: [{error: error.message}]});
    }
}

module.exports = {authenticateJwt, authorizeRole}