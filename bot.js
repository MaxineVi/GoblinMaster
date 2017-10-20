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
    
    // Get everything after firstword
    let afterFirstWord = "";
    
    if (message.content.includes(" ")) {
      
      afterFirstWord = message.content.substring(firstWord.length + 1, message.content.length);
      
    }
  
    // Hello command
    if (message.content === "hello wheybot") {
      // <@userid> is the syntax Discord uses for a mention
      message.channel.send("hello <@" + message.author.id +">!");
    }

    // Echo command
    if (firstWord === "echo") {

      //send message with only the part of the message from the end of the "firstword" to the end of the whole message
      message.channel.send(afterFirstWord);

    }
    
    if (firstWord === "d") {
      
      let diceInput = afterFirstWord;
      
      let splitDiceInput = diceInput.split("*");
      
      console.log(splitDiceInput)
      
      //if NOT not a number (=== is a number)
      if (numSides && !isNaN(numSides) && numSides > 1) {
        
        let dieResult = getRandomInt(1, numSides);
        message.channel.send(dieResult);
        
      } else {
        message.channel.send("The number of sides must be provided as a number greater than 1.");
      }
        
    }
    
  }
  
});

// Random integer function
let getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

client.login(process.env.SECRET);