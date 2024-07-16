const path = require("path");
const fs = require("fs");
const {generatorsId} = require("../utils/utils");
const logs = require("../logger/logger");

const uploadMiddleware = (req, res, next)=>{
    try{
        let file;
        let uploadPath;
        if(req.files === null || typeof req.files === "undefined"){
            return res.status(400).json({message: "Archivo no subido", result: [false]});
        }
        const arrayKeys = Object.keys(req.files);
        if(arrayKeys.length===0){
            return res.status(400).json({message: "Archivo no subido", result: [false]});
        }
        if(arrayKeys[0] === "undefined" || arrayKeys[0] !=="myfile"){
            return res.status(400).json({message: "Archivo no subido", result: [false]});
        }
  
        if(req.files.myfile.constructor.toString().includes("Array")){
            return res.status(400).json({message: "Archivo no subido", result: [false]});
        }
        file = req.files.myfile;
        uploadPath = path.resolve(`${__dirname}/`,"../","storage/",`${file.name}`);
        const ext = file.name.split(".").pop();
        const newName = `file-${Date.now()}-${generatorsId()}.${ext}`;
        const imageExtensions = [
            'mp3', 'wav', 'flac', 'aac', 'wma'
        ];
        if(!imageExtensions.includes(ext.toLowerCase())){
            return res.status(400).json({message: "Archivo no subido", result: [false]});
        }
        file.mv(uploadPath, function(err){
            if(err){
                return res.status(500).json({message: "Error al subir archivo 1", result: [{error: err.message}]});
            }
            logs.error({
                data: "Error al subir archivo, file.mv()"
            })
            fs.renameSync(path.resolve(`${__dirname}/`,"../","storage/",`${file.name}`),path.resolve(`${__dirname}/`,"../","storage/",`${newName}`));
            req.customFile = {name: newName}
            next();
        });
    }catch(error){
        logs.error({
            message: error.message,
            name: error.name,
            stack: error.stack,
            data: "Error al subir archivo"
        })
        res.status(500).json({message: "Error al subir archivo 2", result: [{error: error.message}]});
    }
}
module.exports = {uploadMiddleware};