// bot.js
// where your node app starts

let Discord = require("discord.js");
let client = new Discord.Client();

let commandPrefix = "!";

client.on("message", function (message) {
  // console.log(message.content);
  
  if (message.content.startsWith(commandPrefix)) {
    
    // Remove the prefix
    message.content = message.content.replace(commandPrefix, "");
    
    // Find firstword
    let firstWord = message.content.split(" ")[0];
    
    if (message.content.includes(" ")) {
      
      message.content = message.content.substring(firstWord.length, message.content.length)
      
    }
  
    // Hello command
    if (message.content === "hello wheybot") {
      // <@userid> is the syntax Discord uses for a mention
      message.channel.send("hello <@" + message.author.id +">!");
    }

    // Echo command
    if (firstWord === "echo") {

      //send message with only the part of the message from the end of the "firstword" to the end of the whole message
      message.channel.send();

    }
    
    if (firstWord === "d") {
      
      
        
    }

    console.log(firstWord);
    
  }
  
});

client.login(process.env.SECRET);