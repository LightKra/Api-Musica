const User = require("../models/user");
const UserService = require("../services/userServices");

class UserController{

    /**
     * Controlador para crear usurio en la base de datos
     * @param {*} req 
     * @param {*} res 
     */
    static save = async (req, res)=>{
        try{
            const userJson = req.body;
            const user = new User(userJson);
            const userService = new UserService();
            await userService.save(user);
            res.status(200).json({message: "Datos registrados", result: [true]});
        }catch(error){
            res.status(500).json({message: "Datos No Validos", result: [{error: error.message}]});
        }
    }
    /**
     * controlador para actualizar usuario por id, en la base de datos
     * @param {*} req 
     * @param {*} res 
     */
    static updateId = async (req, res)=>{
        try{
            const id = req.params.id;
            const jsonUser = req.body;
            const userService = new UserService();
            const user = new User(jsonUser);
            await userService.updateId(id, user);
            res.status(200).json({message: "Datos actualizados", result: [true]});
        }catch(error){
            res.status(500).json({message: "No se pudo actualizar, revise sus datos", result: [{error: error.message}]});
        }
    }
    /**
     * controlador para buscar usuario por id, en la base de datos
     * @param {*} req 
     * @param {*} res 
     */
    static findId = async(req, res)=>{
        try{
            const id = req.params.id;
            const userService = new UserService();
            const {rows, fields} = await userService.findId(id);
            if(!Array.isArray(rows)){
                return res.status(200).json({message: "Dato no encontrado", result: [false]});
            }
            if(rows.length === 0){
                res.status(200).json({message: "Dato no encontrado", result: [false]});
            }else{
                const data = {
                    id_usuario: rows[0].id_user,
                    name_user: rows[0].name_user,
                    age_user: rows[0].age_user,
                    email_user: rows[0].email_user,
                    role_user: rows[0].role_user
                }
                res.status(200).json({message: "Dato encontrado", result: data});
            }
        }catch(error){
            res.status(500).json({message: "No se pudo encontrar el usuario", result: [{error: error.message}]});
        }
    }
    /**
     * controlador para buscar todos los usuarios de la base de datos
     * @param {*} req 
     * @param {*} res 
     */
    static allFind = async (req, res)=>{
        try{
            let page = req.query.page;
            let limit = req.query.limit ;
            if(page){
                page = Number(page);
            }else{
                page = 1;
            }
            if(limit){
                limit = Number(limit);
            }else{
                limit = 10
            }
            const offset = (page - 1) * limit;
            const userService = new UserService();
            const {rows, fields} = await userService.allFind(limit, offset);
            if(!Array.isArray(rows)){
                return res.status(200).json({message: "Datos no encontrados", result: [false]});
            }
            if(rows.length === 0){
                res.status(200).json({message: "Datos no encontrados", result: [false]});
            }else{
                res.status(200).json({message: "Datos encontrados", result: rows.map((element)=>{
                    const data = {
                        id_usuario: element.id_user,
                        name_user: element.name_user,
                        age_user: element.age_user,
                        email_user: element.email_user,
                        role_user: element.role_user
                    }
                    return data;
                })});
            }
        }catch(error){
            res.status(500).json({message: "No se puedo consultar todos los usuarios", result: [{error: error.message}]});
        }
    }
    /**
     * controlador para eliminar un usurio por id
     * @param {*} req 
     * @param {*} res 
     */
    static deleteId = async(req, res)=>{
        try{
            const id = req.params.id;
            const userService = new UserService();
            await userService.deleteId(id);
            res.status(200).json({message: "Dato eliminado", result: [true]});
        }catch(error){
            res.status(500).json({message: "No se pudo eliminar el usuario", result: [{error: error.message}]})
        }
    }
}

module.exports = UserController;