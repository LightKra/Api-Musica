const rateLimit = require("express-rate-limit");
const logs = require("../logger/logger");
class RateLimit{
    static generalLimit = ()=>{
        return rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            statusCode: 429,
            message: {result: "Demasiadas peticiones, por favor intente mas tarde"},
            keyGenerator: (req, res) => {
                if(req.headers['x-forwarded-for']){
                    return req.headers['x-forwarded-for'].split(',')[0];
                }
                return req.connection.remoteAddress;
            },
            handler: (req, res, next, options)=>{
                logs.warn({
                    data: `Limite de peticiones excedido para Ip: ${req.ip}`,
                });
                res.status(options.statusCode).json(options.message);
            }
        });
    }
}

module.exports = RateLimit;