const {validationsUserJson} = require("../utils/validations/validationsUser");

class User{
    #id_usuario;
    #name_user;
    #age_user;
    #email_user;
    #password_user;
    #role_user;
    constructor(jsonUser){
       if(validationsUserJson(jsonUser)){
        this.#id_usuario = jsonUser.id_usuario;
        this.#name_user = jsonUser.name_user;
        this.#age_user = jsonUser.age_user;
        this.#email_user = jsonUser.email_user;
        this.#password_user = jsonUser.password_user;
        this.#role_user = jsonUser.role_user;
       }else{
        throw new Error("Error de datos al instanciar la clase Users");
       }         
    }
    get id_usuario(){
        return this.#id_usuario;
    }
    get name_user(){
        return this.#name_user;
    }
    get age_user(){
        return this.#age_user;
    }
    get email_user(){
        return this.#email_user;
    }
    get password_user(){
        return this.#password_user;
    }
    get role_user(){
        return this.#role_user;
    }
    allAttributesArray(){
        return [
            this.#id_usuario,
            this.#name_user,
            this.#age_user,
            this.#email_user,
            this.#password_user,
            this.#role_user
        ];
    }
   
}
module.exports = User;


