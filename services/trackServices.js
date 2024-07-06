const Pool = require("../config/mysql");
const logs = require("../logger/logger");
const {validationClass, validationStringId} = require("../utils/validations/validations")
const StorageService = require("./storageServices");

class TrackService{
    #pool
    constructor(){
        this.#pool = Pool;
    }
    save = async(storage, track)=>{
        let connection;
       try{
        if(!validationClass("Storage",storage)){
            throw new Error("El argumento no es valido, deber ser un instancia de la clase Storage");
        }
        if(!validationClass("Track",track)){
            throw new Error("El argumento no es valido, deber ser un instancia de la clase Track");
        }
        connection = await this.#pool.getConnection();
        await connection.beginTransaction();
        //Storage
        await StorageService.save(storage, connection);
        //track
        const sqlTrack = "insert into trak_tb values(?,?,?,?,?,?,?,?,?)";
        const paramsTrack = track.allAttributesArray();
        const {rows, fields} = await connection.execute(sqlTrack, paramsTrack);
        logs.info({
            data: `datos de track insertados con exito`
        });
        await connection.commit();
        connection.release();
        return {rows, fields}
       }catch(error){
        if(connection){
            await connection.rollback();
            connection.release();
        }
        logs.error({
            message: error.message,
            name: error.name,
            stack: error.stack,
            data: `fallo al insertar datos de track`
        })
        throw new Error(`Error al guardar datos de track: ${error.message}`);
       }
    }
    updateId = async(id, storage, track)=>{
        let connection;
        try{
            if(!validationClass("Storage",storage)){
                throw new Error("El argumento no es valido, deber ser un instancia de la clase Storage");
            }
            if(!validationClass("Track",track)){
                throw new Error("El argumento no es valido, deber ser un instancia de la clase Track");
            }
            if(!validationStringId(id)){
                throw new Error("El id no es valido");
            }
            connection = await this.#pool.getConnection();
            await connection.beginTransaction();
            //storage
            await StorageService.updateId(track.id_storage, storage, connection);
            //track
            const sqlTrack = "update trak_tb set name_trak = ?, name_album = ?, name_artist = ?, nickname_artist = ?, nationality_artist = ?, durationinicio_trak = ?, durationfinal_trak = ? where id_trak = ?";
            const paramsTrack = track.allAttributesArray().filter((element, index)=>index!==0 && index!==8);
            const {rows, fields} = await connection.execute(sqlTrack, [...paramsTrack, id]);
            logs.info({
                data: `datos de track actualizado con exito`
            });
            await connection.commit();
            connection.release();
            return {rows, fields}
        }catch(error){
            if(connection){
                await connection.rollback();
                connection.release();
            }
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al actualizar los datos de track`
            });
            throw new Error(`Error al actualizar los datos de track: ${error.message}`);
        }
    }
    findId = async(id)=>{
        try{
            if(!validationStringId(id)){
                throw new Error("El id no es valido");
            }
            const sql = "select trak_tb.id_trak, trak_tb.name_trak, trak_tb.name_album, trak_tb.name_artist, trak_tb.nickname_artist, trak_tb.nationality_artist, trak_tb.durationinicio_trak, trak_tb.durationfinal_trak, trak_tb.id_storage, storage_tb.url_storage, storage_tb.filename_storage from trak_tb inner join storage_tb on trak_tb.id_storage = storage_tb.id_storage where trak_tb.id_trak = ?";
            const {rows, fields} = await this.#pool.query(sql, [id]);
            logs.info({
                data: `datos de track consultados con exito`
            });
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al consultar datos de track`
            });
            throw new Error(`Error al buscar datos de track: ${error.message}`);
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
            const sql = "SELECT trak_tb.id_trak, trak_tb.name_trak, trak_tb.name_album, trak_tb.name_artist, trak_tb.nickname_artist, trak_tb.nationality_artist, trak_tb.durationinicio_trak, trak_tb.durationfinal_trak, trak_tb.id_storage, storage_tb.url_storage, storage_tb.filename_storage FROM trak_tb INNER JOIN storage_tb ON trak_tb.id_storage = storage_tb.id_storage LIMIT ? OFFSET ?";
            const {rows, fields} = await this.#pool.query(sql, [`${limit}`, `${offset}`]);
            logs.info({
                data: "todos los tracks consultados con exito"
            })
            return {rows, fields}
        }catch(error){
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al consultar todos los tracks`
            });
            throw new Error(`Error al buscar todos los tracks: ${error.message}`);
        }
    }
    deleteId = async(id)=>{
        let connection;
        try{
            if(!validationStringId(id)){
                throw new Error("El id no es valido");
            }
            //busqueda del id_storage
            const sqlFind = "select trak_tb.id_trak, trak_tb.name_trak, trak_tb.name_album, trak_tb.name_artist, trak_tb.nickname_artist, trak_tb.nationality_artist, trak_tb.durationinicio_trak, trak_tb.durationfinal_trak, trak_tb.id_storage, storage_tb.url_storage, storage_tb.filename_storage from trak_tb inner join storage_tb on trak_tb.id_storage = storage_tb.id_storage where trak_tb.id_trak = ?";
            const jsonTrack = await this.#pool.query(sqlFind, [id]);
            let resTrack = {rows: [], fields: []}
            //nueva conexion
            connection = await this.#pool.getConnection();
            await connection.beginTransaction();
            if(!Array.isArray(jsonTrack.rows)){
                throw new Error("No se pudo encontrar el storage del track");
            }
            if(jsonTrack.rows.length !== 0){
                const id_storage = jsonTrack.rows[0].id_storage; 
                const sqlTrack = "delete from trak_tb where id_trak = ?";
                resTrack = await connection.execute(sqlTrack, [id]);
                await StorageService.deleteId(id_storage, connection);
                logs.info({
                    data: `Se elimino el track con exito`
                });
            }else{
                throw new Error("No se pudo encontrar el storage del track");
            }
            await connection.commit();
            connection.release();
            return {rows: resTrack.rows, fields: resTrack.fields}
        }catch(error){
            if(connection){
                await connection.rollback();
                connection.release();
            }
            logs.error({
                message: error.message,
                name: error.name,
                stack: error.stack,
                data: `fallo al eliminar track`
            });
            throw new Error(`Error no se pudo eliminar el track: ${error.message}`);
        }
    }
}

module.exports = TrackService;