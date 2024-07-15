require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload")
const cors = require("cors");
const morgan = require("morgan-body");
const RateLimit = require("./middleware/rateLimit");
const logs = require("./logger/logger");
const {jsonMorgan} = require("./logger/loggerMorgan");
const routes = require("./routes/main");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    allowedHeaders: ['Content-Type', 'authorization'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'] ,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));
app.set('trust proxy', true);
app.use(RateLimit.generalLimit());
app.use(fileUpload());
app.use(express.json());
morgan(app,jsonMorgan);
app.use(express.urlencoded({extended: true}));
app.get('/ip', (request, response) => response.send(request.ip));
app.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))
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
