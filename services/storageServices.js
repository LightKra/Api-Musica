const Pool = require("../config/mysql");
const logs = require("../logger/logger");
const {validationClass, validationStringId} = require("../utils/validations/validations");

class StorageService{
    #pool
    constructor(){
        this.#pool = Pool;
    }
    static save = async (storage, connection)=>{
        try{
            if(!validationClass("Storage",storage)){
                throw new Error("Error no es una instancia de Storage");
            }
            const sql = "insert into storage_tb values(?,?,?)";
            const params = storage.allAttributesArray();
            const {rows, fields} = await connection.execute(sql, params);
            logs.info({
                data: `datos de storage insertados con exito`
            });
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al insertar datos de storage`
            });
            throw new Error(`Error al guardar datos del storage: ${error.message}`);
        }
    }
    static updateId = async (id, storage, connection)=>{
        try{
            if(!validationClass("Storage",storage)){
                throw new Error("Error no es una instancia de Storage");
            }
            if(!validationStringId(id)){
                throw new Error("Error Id no valido");
            }
            const sql = "update storage_tb set url_storage = ?, filename_storage = ? where id_storage = ?";
            const params = storage.allAttributesArray().filter((element,idx)=>idx!==0);
            const {rows, fields} = await connection.execute(sql, [...params, id]);
            logs.info({
                data: `datos de storage actualizados con exito`
            });
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al actualizar los datos de storage`
            });
            throw new Error(`Error al actualizar el storage: ${error.message}`);
        }
    }
    findId = async (id)=>{
        try{
            if(!validationStringId(id)){
                throw new Error("Error Id no valido");
            }
            const sql = "select * from storage_tb where id_storage = ?";
            const {rows, fields} = await this.#pool.query(sql, [id]);
            logs.info({
                data: `datos de storage consultados con exito`
            });
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al consultar storage`
            });
            throw new Error(`Error al buscar datos de storage con id: ${error.message}`);
        }
    }
    allFind = async (limit, offset)=>{
        try{
            if(typeof limit !== "number"){
                throw new Error("limit debe ser un dato de tipo number");
            }
            if(typeof offset !== "number"){
                throw new Error("offset debe ser un dato de tipo number");
            }
            const sql = "select * from storage_tb limit ? offset ?";
            const {rows, fields} = await this.#pool.query(sql, [limit, offset]);
            logs.info({
                data: "todo el storage consultado con exito"
            })
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al consutlar todo el storage`
            });
            throw new Error(`Error al buscar todos los storage: ${error.message}`);
        }
    }
    static deleteId = async (id, connection)=>{
        try{
            if(!validationStringId(id)){
                throw new Error("Error Id no valido");
            }
            const sql = "delete from storage_tb where id_storage = ?";
            const {rows, fields} = await connection.execute(sql,[id]);
            logs.info({
                data: `Se elimino el storage con exito`
            })
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `Fallo al eliminar storage`
            });
            throw new Error(`Error no se pudo eliminar el storage: ${error.message}`);
        }
    }
}
module.exports = StorageService;