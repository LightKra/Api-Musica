const {validationsTrackJson} = require("../utils/validations/validationsTracks")

class Track {
    #id_track;
    #name_track;
    #name_album;
    #name_artist;
    #nickname_artist;
    #nationality_artist;
    #durationinicio_track;
    #durationfinal_track;
    #id_storage;
    constructor(jsonTrack){
        if(validationsTrackJson(jsonTrack)){
            this.#id_track = jsonTrack.id_track;
            this.#name_track = jsonTrack.name_track;
            this.#name_album = jsonTrack.name_album;
            this.#name_artist = jsonTrack.name_artist;
            this.#nickname_artist = jsonTrack.nickname_artist;
            this.#nationality_artist = jsonTrack.nationality_artist;
            this.#durationinicio_track = jsonTrack.durationinicio_track;
            this.#durationfinal_track = jsonTrack.durationfinal_track;
            this.#id_storage = jsonTrack.id_storage;
        }else{
            throw new Error("Error de datos al instanciar la clase Track")
        }
    }
    //getter
    get id_track(){
        return this.#id_track;
    }
    get name_track(){
        return this.#name_track;
    }
    get name_album(){
        return this.#name_album;
    }
    get name_artist(){
        return this.#name_artist;
    }
    get nickname_artist(){
        return this.#nickname_artist;
    }
    get nationality_artist(){
        return this.#nationality_artist;
    }
    get durationinicio_track(){
        return this.#durationinicio_track;
    }
    get durationfinal_track(){
        return this.#durationfinal_track;
    }
    get id_storage(){
        return this.#id_storage;
    }
    
    allAttributesArray(){
        return [
            this.#id_track,
            this.#name_track,
            this.#name_album,
            this.#name_artist,
            this.#nickname_artist,
            this.#nationality_artist,
            this.#durationinicio_track,
            this.#durationfinal_track,
            this.#id_storage
        ];
    }
}

module.exports = Track;