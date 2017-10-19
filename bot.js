// bot.js
// where your node app starts

let Discord = require("discord.js");
let client = new Discord.Client();

client.on("message", function (message) {
  console.log(message);
});

client.login(process.env.SECRET);