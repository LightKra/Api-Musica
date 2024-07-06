const winston = require("winston");
const path = require("path");
const {validationProductionStatus} = require("../utils/validations/validations");
require("dotenv").config({
    path: path.resolve(`${__dirname}`,"../",".env")
})
require("winston-daily-rotate-file");

class Logger {
    static instance;
    #logger;
    constructor(){
        if(Logger.instance){
            return Logger.instance;
        }
        try{
            const logFormat = winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
            if(validationProductionStatus(process.env.NODE_ENV)){
                const transport1 = new winston.transports.DailyRotateFile({
                    level: process.env.LOG_LEVEL || "info",
                    filename: path.resolve(`${__dirname}/`,"logs/","app-%DATE%.log"),
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                })
                transport1.on("error", error=>{
                    console.error("Error en log: ", error);
                })
                transport1.on("rotate", (oldFilename, newFilename)=>{
                    console.log("Archivo log rotado");
                })

                this.#logger = winston.createLogger({
                    level: process.env.LOG_LEVEL || "info",
                    format: logFormat,
                    transports: [
                        transport1
                    ]
                });
            }else{
                this.#logger = winston.createLogger({
                    level: process.env.LOG_LEVEL || "info",
                    format: winston.format.json(),
                    transports: [
                        new winston.transports.Console()
                    ]
                });
            }
        }catch(error){
            throw new Error("Error al intentar crear el Logger con Winston: ", error);
        }
        Logger.instance = this;
    }

    log = (level, message)=>{
        this.#logger.log(level, message);
    }

    info = (message)=>{
        this.#logger.info(message);
    }

    warn = (message)=>{
        this.#logger.warn(message);
    }
    error = (message)=>{
        this.#logger.error(message);
    }
}

module.exports = new Logger();