// bot.js
// where your node app starts

let mexp = require("math-expression-evaluator");

let Discord = require("discord.js");
let client = new Discord.Client();

let fs = require("fs");

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
    
    if (firstWord === "dw") {
      
      printTextCommandDW(afterFirstWord, message);
      
    }
    
    if (firstWord === "hw") {
      
      printTextCommandHW(afterFirstWord, message);
      
    }
    
    if (firstWord === "roll") {
      
      diceRollCommand2d6(afterFirstWord, message);
      
    }
  }
  
});

let printTextCommandDW = function (argument, message) {
  
  // Remove all non-alphanumeric characters
  // argument = argument.replace(/\W/g, '');
  
  
  // readFile takes the following arguments: path to file, callback function  
  fs.readFile("./texts/dwrules.txt", "utf8", function (error, data) {
    if (error) {
      message.channel.send("text file could not be accessed");
    } else {
      
      let fileSection;
      
      let controlSequence = "---";
      
      // Split string on ---argument and get everything after it
      fileSection = data.split(controlSequence + argument)[1];
      
      if (!fileSection) {
        message.channel.send("Couldn't find that rule.");
        return false;
      }
            
      // Now we need to remove everything after the following --- (or else it's end of file)
      fileSection = fileSection.split(controlSequence)[0];
            
      
      let embed = new Discord.RichEmbed({
        "title": argument,
        "description": fileSection
      });
      
      message.channel.sendEmbed(embed);
    }
  });
  
//   // readFile takes the following arguments: path to file, callback function  
//   fs.readFile("./texts/" + argument + ".txt", "utf8", function (error, data) {
//     if (error) {
//       message.channel.send("couldn't find that text");
//     } else {
//       console.log(data)
      
//       message.channel.send(data);
//     }
//   });
  
};

let printTextCommandHW = function (argument, message) {
    
  fs.readFile("./texts/hwrules.txt", "utf8", function (error, data) {
    if (error) {
      message.channel.send("text file could not be accessed");
    } else {
      
      let fileSection;
      
      let controlSequence = "---";
      
      fileSection = data.split(controlSequence + argument)[1];
      
      if (!fileSection) {
        message.channel.send("Couldn't find that rule.");
        return false;
      }
            
      fileSection = fileSection.split(controlSequence)[0];
            
      
      let embed = new Discord.RichEmbed({
        "title": argument,
        "description": fileSection
      });
      
      message.channel.sendEmbed(embed);
    }
  });
};

let calcCommand = function (expression, message) {
  
  try {
  
    let result = mexp.eval(expression);
  
    message.channel.send(result);
    
  } catch (e) {
    
    message.channel.send("Couldn't calculate that. Expression parser says: *" + e.message + "*");
    
  }
  
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

let diceRollCommand2d6 = function (numInput, message) {
  
  // numInput is raw user input
  // numToAdd is the parsed number
  let numToAdd = 0;

  if (numInput == "") {
    // no input provided, assume we add 0
    // numToAdd is alread 0, don't do anything
  } else if (isNaN(numInput)) {
    // not a number, return an error message
    message.channel.send("The number to add is not valid.");
    return false; // exit without doing anything
  } else {
    numToAdd = parseInt(numInput);
  }
  
  let dieTotal = 0;
  let dieResults = [];
  
  // set first die roll
  dieResults.push( getRandomInt(1,6) ); // first roll
  dieResults.push( getRandomInt(1,6) ); // second roll
  // set total
  dieTotal = dieResults[0] + dieResults[1];
  
  let resultTotal = dieTotal + numToAdd;
  
  message.channel.send("Roll results: " + dieResults.toString() + "\nTotal:\t" + dieTotal + " + " + numToAdd + " = " + resultTotal);
  
}

// Random integer function
let getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

client.login(process.env.SECRET);