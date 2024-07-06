const Pool = require("../config/mysql");
const {validationClass, validationStringId} =require("../utils/validations/validations");
const logs = require("../logger/logger");
class UserService{
   #pool
    constructor(){
      this.#pool = Pool;
    }
    save = async (user)=>{
        try{
          if(!validationClass("User", user)){
            throw new Error("El argumento debe ser una instancia de la Clase User");
          }
          const sql = "INSERT INTO user_tb VALUES (?,?,?,?,?,?)";
          const params = user.allAttributesArray();
          const {rows, fields} = await this.#pool.query(sql, params);
          logs.info({
            data: `datos de usuario insertados con exito`
          });
          return {rows, fields}
        }catch(error){
          logs.error({
            message: error.message,
            name: error.name,
            stack: error.stack,
            data: `fallo al insertar datos de usuario`
          })
          throw new Error(`Error al guardar datos de usuario: ${error.message}`);
        }
    }
    updateId = async (id, user)=>{
      try{
        if(!validationClass("User", user)){
          throw new Error("El argumento debe ser una instancia de la Clase User");
        }
        if(!validationStringId(id)){
          throw new Error('El id no es valido');
        }
        const sql = "update user_tb set name_user = ?, age_user = ?, email_user = ?, password_user= ?, role_user = ? where id_user = ?";
        const params = user.allAttributesArray().filter((element, index, array)=> index !== 0);
        const {rows, fields} = await this.#pool.query(sql, [...params, id]);
        logs.info({
          data: `datos de usuario actualizados con exito`
        })
        return {rows, fields}
      }catch(error){
        logs.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: `fallo al actualizar datos de usuario`
        })
        throw new Error(`Error al actualizar los datos de usuario: ${error.message}`);
      }
    }
    findId = async (id)=>{
      try{
        if(!validationStringId(id)){
          throw new Error('El id no es valido');
        }
        const sql = "select * from user_tb where id_user = ?";
        const {rows, fields} = await this.#pool.query(sql, [id]);
        logs.info({
          data: `datos de usuario consultados con exito`
        });
        return {rows, fields}  
      }catch(error){
        logs.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: `fallo al consultar usuario`
        })
        throw new Error(`Error al buscar datos del usuario con id: ${error.message}`)
      }
    }
    findEmail = async (email)=>{
      try{
        const sql = "select * from user_tb where	email_user = ?";
        const {rows, fields} = await this.#pool.query(sql, [email]);
        logs.info({
          data: `datos de usuario consultados con exito`
        });
        return {rows, fields}  
      }catch(error){
        logs.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: `fallo al consultar usuario`
        })
        throw new Error(`Error al buscar datos del usuario con id: ${error.message}`)
      }
    }
    allFind = async(limit, offset)=>{
      try{
        if(typeof limit !== "number"){
          throw new Error("limit debe ser un dato de tipo number");
        }
        if(typeof offset !== "number"){
            throw new Error("offset debe ser un dato de tipo number");
        }
        const sql = "select * from user_tb limit ? offset ?";
        const {rows, fields} = await this.#pool.query(sql,[`${limit}`, `${offset}`]);
        logs.info({
          data: `todos los usuarios consultados con exito`
        })
        return {rows, fields}
      }catch(error){ 
        logs.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: `fallo al consultar todos lo usuarios`
        })
        throw new Error(`Error al buscar todos los usuarios: ${error.message}`);
      }
    }
    deleteId = async(id)=>{
      try{
        if(!validationStringId(id)){
          throw new Error('El id no es valido');
        }
        const sql = "delete from user_tb where id_user = ?";
        const {rows, fields} = await this.#pool.query(sql, [id]);
        logs.info({
          data: `se elimino el usuario con exito`
        });
        return {rows, fields}
      }catch(error){
        logs.error({
          message: error.message,
          name: error.name,
          stack: error.stack,
          data: `fallo al eliminar usuario`
        })
        throw new Error(`Error no se pudo eliminar el usuario con id: ${error.message}`);
      }
    }
    
}
module.exports = UserService;