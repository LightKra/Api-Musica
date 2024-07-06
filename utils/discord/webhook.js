const {EmbedBuilder, WebhookClient} = require("discord.js");
const path = require("path");
require("dotenv").config({
    path: path.resolve(`${__dirname}`,"../", "../", ".env")
})

const webhookClient = new WebhookClient({url: process.env.URL_DISCORD});
const embed = new EmbedBuilder().setTitle("Reporte de Errores").setColor(0x00FFFF);

const sendMessage = (message)=>{
    if(typeof message !== "string"){
        return;
    }
    webhookClient.send({
        content: message,
        username: "ApiError",
        avatarURL: "https://i.imgur.com/AfFp7pu.png",
        embeds: [embed]
    });
}
sendMessage();

module.exports = {sendMessage}