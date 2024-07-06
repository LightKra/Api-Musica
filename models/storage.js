const {validationsStorageJson} = require("../utils/validations/validationsStorage");
class Storage{
    #id_storage;
    #url_storage;
    #filename_storage;
    constructor(jsonStorage){
        if(validationsStorageJson(jsonStorage)){
            this.#id_storage = jsonStorage.id_storage;
            this.#url_storage = jsonStorage.url_storage;
            this.#filename_storage = jsonStorage.filename_storage
        }else{
            throw new Error("Error de datos al instanciar la clase Storage");
        }
    }
    get id_storage(){
        return this.#id_storage;
    }
    get url_storage(){
        return this.#url_storage;
    }
    get filename_storage(){
        return this.#filename_storage;
    }
    allAttributesArray(){
        return [
            this.#id_storage,
            this.#url_storage,
            this.#filename_storage
        ];
    }
}

module.exports = Storage;