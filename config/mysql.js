const mysql2 = require("mysql2/promise");
const logs = require("../logger/logger");
const config = require("./dataBaseConfig");

class PoolBd {
    #pool;
    static instance
    constructor(){
        if(PoolBd.instance){
            return PoolBd.instance;
        }
        try{
            this.#pool = mysql2.createPool(config);
            PoolBd.instance = this;
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: "Error al conectar la base de datos"
            });
            throw new Error(`Error al crear instancia para conexion Myql: ${error.message}`);
        }
    }
    //metodo para ejecutar consultas simples
    query = async (sql, params=[])=>{
        try{
            const [rows, fields] = await this.#pool.execute(sql, params);
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: "Error al hacer query .excute(), a la base de datos"
            });
            throw new Error(`Error al ejecutar sentencia SQL: ${error.message}`);
        }
    }
    //Metodo para obtener una conexion del pool
    getConnection = async ()=>{
        try{
            return await this.#pool.getConnection();
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: "Error al crear nueva conexion"
            });
            throw new Error(`Error al crear nueva conexion: ${error.message}`);
        }
    }
}
module.exports = new PoolBd();