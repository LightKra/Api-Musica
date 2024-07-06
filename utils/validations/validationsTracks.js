const joi = require("joi");
/**
 * funcion para validacion para el tipo de dato piesta de musica (track)
 * @param {*} jsonTrack 
 * @returns boolean
 */
const validationsTrackJson = (jsonTrack)=>{
    if(!jsonTrack){
        return false;
    }
    const schema = joi.object({
        id_track: joi.string()
                        .min(20)
                        .max(50)
                        .required(),
        name_track: joi.string()
                        .min(3)
                        .max(70)
                        .required(),
        name_album: joi.string()
                        .min(3)
                        .max(70)
                        .required(),
        name_artist: joi.string()
                        .min(3)
                        .max(70)
                        .required(),
        nickname_artist: joi.string()
                        .min(3)
                        .max(70)
                        .required(),
        nationality_artist: joi.string()
                            .min(3)
                            .max(70)
                            .required(),
        durationinicio_track: joi.number()
                            .required(),
        durationfinal_track: joi.number()
                            .required(),
        id_storage: joi.string()
                    .min(20)
                    .max(50)
                    .required()
    });
    const {error} = schema.validate(jsonTrack);
    if(typeof error === "undefined"){
       return true;
    }
    return false;    
}

module.exports = {validationsTrackJson}