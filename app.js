require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload")
const cors = require("cors");
const helmet = require('helmet');
const morgan = require("morgan-body");
const RateLimit = require("./middleware/rateLimit");
const logs = require("./logger/logger");
const {jsonMorgan} = require("./logger/loggerMorgan");
const routes = require("./routes/main");
const app = express();
const port = process.env.PORT || 3000;
app.use("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(helmet());
morgan(app,jsonMorgan);
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(RateLimit.generalLimit());
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
