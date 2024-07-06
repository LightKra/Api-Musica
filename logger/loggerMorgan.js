const {sendMessage} = require("../utils/discord/webhook");

 const logger = {
    write: message =>{
        sendMessage(message);
    }
}
const jsonMorgan = {
        noColors: true,
        skip: function (req, res){return res.statusCode <400},
        stream: logger
    }

module.exports = {jsonMorgan}