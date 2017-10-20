// bot.js
// where your node app starts

let textCalculator = require("text-calculator");

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
      
      diceRollCommand(afterFirstWord, message);
        
    }
    
    if (firstWord === "c") {
      
      calcCommand(afterFirstWord, message);
      
    }
    
  }
  
});

let calcCommand = function (expression, message) {
  
  textCalculator.calculate(expression, function (result) {
    
    message.channel.send(result);
    
  });
  
}

let diceRollCommand = function (diceInput, message) {
  
  let splitDiceInput = diceInput.split("*");

  let numSides = splitDiceInput[0];
  let numRolls = splitDiceInput[1];
  
  console.log(numSides)
  console.log(numRolls)
  
  if (numRolls) {
    // if numRolls isn't a number, OR if it's a number less than 1
    if (isNaN(numRolls) || numRolls < 1) {
      message.channel.send("The number of rolls is not valid.");
      return false; // exit the function without doing anything else
    }
  } else {
    numRolls = 1;
  }

  //if NOT not a number (=== is a number) AND if it exists AND if it's greater than 1
  if (numSides && !isNaN(numSides) && numSides > 1) {

    let dieTotal = 0;
    
    let dieResults = [];
    
    // for "i" from zero to the number of rolls we want, run this loop i times
    for (let i = 0; i < numRolls; i++) {
      
      let thisRoll = getRandomInt(1, numSides);
      
      dieResults.push(thisRoll);
      
      dieTotal = dieTotal + thisRoll;
      
    }
    
    message.channel.send("Roll results: " + dieResults.toString() + "\nTotal: " + dieTotal);

  } else {
    message.channel.send("The number of sides must be provided as a number greater than 1.");
  }
  
}

// Random integer function
let getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

client.login(process.env.SECRET);