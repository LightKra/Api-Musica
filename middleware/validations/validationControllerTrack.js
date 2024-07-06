const {generatorsId} = require("../../utils/utils")
const {validationsTrackJson} = require("../../utils/validations/validationsTracks");
const TrackService = require("../../services/trackServices");

const validationControllerTrackPost = (req, res, next)=>{
    try{
        const jsonTrack = req.body;
        jsonTrack.id_track = generatorsId();
        if(typeof jsonTrack.durationinicio_track === "string"){
            if(jsonTrack.durationinicio_track.trim() !== ""){
                jsonTrack.durationinicio_track = Number(jsonTrack.durationinicio_track);
            }
        }
        if(typeof jsonTrack.durationfinal_track === "string"){
            if(jsonTrack.durationfinal_track.trim() !== ""){
                jsonTrack.durationfinal_track = Number(jsonTrack.durationfinal_track);
            }
        }
        jsonTrack.id_storage = generatorsId();
        if(!validationsTrackJson(jsonTrack)){
            return res.status(400).json({message: "Datos No validos", result: [false]});
        }
        req.body = jsonTrack;
        next();
    }catch(error){
        res.status(500).json({message: "Ocurrio un error inesperado", result: [{error: error.message}]});
    }
}
const validationControllerTrackPutId = (req, res, next)=>{
    try{
        const trackServiceFind = new TrackService();
        const jsonTrack = req.body;
        const id = req.params.id;
        trackServiceFind.findId(id).then(response=>{
            if(!Array.isArray(response.rows)){
                return res.status(400).json({message: "No se pudo actualizar, el track no existe", result: [false]});
            }
            if(response.rows.length === 0){
                return res.status(400).json({message: "No se pudo actualizar, el track no existe", result: [false]});
            }
            req.oldFilename = {filename: response.rows[0].filename_storage}
            jsonTrack.id_track = id;
            jsonTrack.id_storage = response.rows[0].id_storage;
            if(typeof jsonTrack.durationinicio_track === "string"){
                if(jsonTrack.durationinicio_track.trim() !== ""){
                    jsonTrack.durationinicio_track = Number(jsonTrack.durationinicio_track);
                }
            }
            if(typeof jsonTrack.durationfinal_track === "string"){
                if(jsonTrack.durationfinal_track.trim() !== ""){
                    jsonTrack.durationfinal_track = Number(jsonTrack.durationfinal_track);
                }
            }
            if(!validationsTrackJson(jsonTrack)){
                return res.status(400).json({message: "Datos No validos", result: [false]});
            }
            req.body = jsonTrack;  
            next();
        });
    }catch(error){
        res.status(500).json({message: "Ocurrio un error inesperado", result: [{error: error.message}]});
    }
}
const validationControllerTrackDeleteId = (req, res, next)=>{
    try{
        const trackServiceFind = new TrackService();
        const id = req.params.id;
        trackServiceFind.findId(id).then(response=>{
        if(!Array.isArray(response.rows)){
            return res.status(400).json({message: "No se pudo eliminar, el track no existe", result: [false]});
        }
        if(response.rows.length === 0){
            return res.status(400).json({message: "No se pudo eliminar, el track no existe", result: [false]});
        }
        req.oldFilename = {filename: response.rows[0].filename_storage}
        next();
    });
    }catch(error){
        res.status(500).json({message: "Ocurrio un error inesperado", result: [{error: error.message}]});
    }
}
module.exports = {validationControllerTrackPost, validationControllerTrackPutId, validationControllerTrackDeleteId}