const { PutObjectCommand, S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3ClientConfig = require("../../config/spacesConfig");
const logs = require("../../logger/logger");

const s3Client = new S3Client(s3ClientConfig);

const uploadObject = async(params)=>{
    try{
        const command = new PutObjectCommand(params);
        const response = await s3Client.send(command);
        return response
    }catch(error){
        logs.error({
            message: error.message,
            name: error.name,
            stack: error.stack,
            data: "Error al subir archivos al space"
        })
        throw new Error(`Error al subir archivos al space: ${error}`);
    }
}
const deleteObject = async (params)=>{
    try{
        const command = new DeleteObjectCommand(params);
        const response = await s3Client.send(command);
        return response;
    }catch(error){
        logs.error({
            message: error.message,
            name: error.name,
            stack: error.stack,
            data: "Error al subir archivos al space"
        })
        throw new Error(`Error al eliminar archivo del space: ${error}`);
    }
}
module.exports = {uploadObject, deleteObject}