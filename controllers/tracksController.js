const TrackService = require("../services/trackServices");
const Track = require("../models/track");
const Storage = require("../models/storage");
const {removeStorage} = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const {uploadObject, deleteObject} = require("../utils/digital ocean/spaces");
require("dotenv").config({
    path: path.resolve(`${__dirname}`,"../",".env")
})
class TrackController{
    static save = async (req, res)=>{
        const jsonTrack = req.body;
        const fileName = req.customFile.name;
        try{
            //storage
            const urlFile = `${process.env.PUBLIC_URL}/${fileName}`;
            const storage = new Storage({id_storage: jsonTrack.id_storage, url_storage: urlFile, filename_storage: fileName});
            //track
            const track = new Track(jsonTrack);
            const trackService = new TrackService();
            //ejecucion de las operaciones
            await trackService.save(storage, track);	
            const responseObjectUpload = await uploadObject({
                Bucket: "storage44",
                Key: fileName,
                Body: fs.readFileSync(path.resolve(`${__dirname}/`,"../", "storage/",`${fileName}`)),
                ACL: "public-read-write",
                Metadata: {
                    date: `${Date.now()}`
                }
            });
            removeStorage(fileName);
            res.status(200).json({message: "Datos registrados", result: [true]});
        }catch(error){
            removeStorage(fileName);
            res.status(500).json({message: "Datos no Validos", result: [{error: error.message}]});
        }
    }
    static updateId = async (req, res)=>{
        const id = req.params.id;
        const jsonTrack = req.body;
        const fileName = req.customFile.name;
        const oldFilename = req.oldFilename.filename;
        try{
            //storage
            const urlFile = `${process.env.PUBLIC_URL}/${fileName}`;
            const storage = new Storage({id_storage: jsonTrack.id_storage, url_storage: urlFile, filename_storage: fileName});
            //track
            const track = new Track(jsonTrack);
            const trackService = new TrackService();
            await trackService.updateId(id, storage, track);
            const responseObjectUpload = await uploadObject({
                Bucket: "storage44",
                Key: fileName,
                Body: fs.readFileSync(path.resolve(`${__dirname}/`,"../", "storage/",`${fileName}`)),
                ACL: "public-read-write",
                Metadata: {
                    date: `${Date.now()}`
                }
            });
            const responseObjectDelete = await deleteObject({
                Bucket: "storage44",
                Key: oldFilename
            });
            removeStorage(fileName);
            res.status(200).json({message: "Datos actualizados", result: [true]});
        }catch(error){
            removeStorage(fileName);
            res.status(500).json({message: "No se pudo actualizar, revise sus datos", result: [{error: error.message}]});
        }
    }
    static findId = async (req, res)=>{
        try{
            const id = req.params.id;
            const trackService = new TrackService();
            const {rows, fields} = await trackService.findId(id);
            if(!Array.isArray(rows)){
                return res.status(200).json({message: "Dato no encontrado", result: [false]});
            }
            if(rows.length === 0){
                res.status(200).json({message: "Dato no encontrado", result: [false]});
            }else{
                const data = {
                    id_track: rows[0].id_trak,
                    name_track: rows[0].name_trak,
                    name_album: rows[0].name_album,
                    name_artist: rows[0].name_artist,
                    nickname_artist: rows[0].nickname_artist,
                    nationality_artist: rows[0].nationality_artist,
                    durationinicio_track: rows[0].durationinicio_trak,
                    durationfinal_track: rows[0].durationfinal_trak,
                    id_storage: rows[0].id_storage,
                    url_storage: rows[0].url_storage,
                    filename_storage: rows[0].filename_storage
                }
                res.status(200).json({message: "Dato encontrado", result: data});
            }
        }catch(error){
            res.status(500).json({message: "No se pudo encontrar el track", result: [{error: error.message}]});
        }
    }
    static allFind = async(req, res)=>{
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
            const trackService = new TrackService();
            const {rows, fields} = await trackService.allFind(limit, offset);
            if(!Array.isArray(rows)){
                return res.status(200).json({message: "Datos no encontrados", result: [false]});
            }
            if(rows.length === 0){
                return res.status(200).json({message: "Datos no encontrados", result: [false]});
            }else{
                res.status(200).json({message: "Datos encontrados", result: rows.map((element)=>{
                    const data = {
                        id_track: element.id_trak,
                        name_track: element.name_trak,
                        name_album: element.name_album,
                        name_artist: element.name_artist,
                        nickname_artist: element.nickname_artist,
                        nationality_artist: element.nationality_artist,
                        durationinicio_track: element.durationinicio_trak,
                        durationfinal_track: element.durationfinal_trak,
                        id_storage: element.id_storage,
                        url_storage: element.url_storage,
                        filename_storage: element.filename_storage
                    }
                    return data;
                })});
            }
        }catch(error){
            res.status(500).json({message: "No se pudo consultar todos los tracks", result: [{error: error.message}]});
        }
    }
    static deleteId = async(req, res)=>{
        try{
            const id = req.params.id;
            const oldFilename = req.oldFilename.filename;
            const trackService = new TrackService();
            const {rows, fields} = await trackService.deleteId(id);
            removeStorage(oldFilename);
            res.status(200).json({message: "Dato eliminado", result: [true]});
        }catch(error){
            res.status(500).json({message: "No se pudo eliminar track", result: [{error: error.message}]});
        }
    }
}
module.exports = TrackController;