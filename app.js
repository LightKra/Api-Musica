require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload")
const morgan = require("morgan-body");
const cors = require("cors");
const RateLimit = require("./middleware/rateLimit");
const logs = require("./logger/logger");
const {jsonMorgan} = require("./logger/loggerMorgan");
const routes = require("./routes/main");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Cambia esto según tu entorno
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ]
}));
  
app.set('trust proxy', true);
app.use(RateLimit.generalLimit());
app.use(fileUpload());
app.use(express.json());
morgan(app,jsonMorgan);
app.use(express.urlencoded({extended: true}));
app.use("/api",routes);
app.use(express.static(`${__dirname}/storage`));
app.use((err, req, res, next)=>{
    logs.error({
        message: err.message,
        name: err.name,
        stack: err.stack,
        data: "Error algo salio mal"
    });
    res.status(500).json({
        result: "Error algo salio mal"
    })
});
process.on("uncaughtException", (err)=>{
    logs.error({
        message: err.message,
        name: err.name,
        stack: err.stack,
        data: "Error "
    });
    process.exit(1);
});
process.on("unhandledRejection",(reason, promise)=>{
    logs.error({
        data: `Promesa rechazada sin manejar: ${promise}, razon: ${reason}`
    });
    process.exit(1);
});
app.listen(port, ()=>{
    logs.info({
        data: `Servidor conectado puerto: ${port}`
    })
});
