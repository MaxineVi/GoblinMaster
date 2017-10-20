// bot.js
// where your node app starts

let Discord = require("discord.js");
let client = new Discord.Client();

client.on("message", function (message) {
  // console.log(message.content);
  
  if (message.content === "hello wheybot") {
    // <@userid> is the syntax Discord uses for a mention
    message.channel.send("hello <@" + message.author.id +">!");
  }
  
  if (message.content === "") {}
  
  let messageSplit = message.split("");
  
  console.log(messageSplit[0]);
  
});

client.login(process.env.SECRET);