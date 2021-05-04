// bot.js
// where your node app starts

let mexp = require("math-expression-evaluator");

let Discord = require("discord.js");
let client = new Discord.Client();

let fs = require("fs");

let commandPrefix = "!";

client.on("message", function(message) {
  // console.log(message.content);

  if (message.content.startsWith(commandPrefix)) {
    // Remove the prefix
    message.content = message.content.replace(commandPrefix, "");

    // Find firstword
    let firstWord = message.content.split(" ")[0];

    // Get everything after firstword
    let afterFirstWord = "";

    if (message.content.includes(" ")) {
      afterFirstWord = message.content.substring(
        firstWord.length + 1,
        message.content.length
      );
    }

    // Hello command
    if (message.content === "hello GoblinMaster") {
      // <@userid> is the syntax Discord uses for a mention
      message.channel.send("hello <@" + message.author.id + ">!");
    }

    // Echo command
    if (firstWord === "echo") {
      //send message with only the part of the message from the end of the "firstword" to the end of the whole message
      message.channel.send(afterFirstWord);
    }

    if (firstWord === "d") {
      diceRollCommand(afterFirstWord, message);
    }

    if (/^d\d+/.exec(message.content)) {
      diceRollCommand(/d(.*)$/.exec(message.content)[1], message);
    }

    if (firstWord === "c") {
      calcCommand(afterFirstWord, message);
    }

    if (firstWord === "bd") {
      printTextCommand(afterFirstWord, message, "bdrules.txt");
    }
    
    if (firstWord === "dw") {
      printTextCommand(afterFirstWord, message, "dwrules.txt");
    }

    if (firstWord === "hw") {
      printTextCommand(afterFirstWord, message, "hwrules.txt");
    }

    if (firstWord === "roll") {
      diceRollCommand2d6(afterFirstWord, message);
    }

    if (/^roll[\+\-]?\d+/.exec(message.content)) {
      diceRollCommand2d6(/^roll(.*)$/.exec(message.content)[1], message);
    }
  }
});

let printTextCommand = function(argument, message, file) {
  fs.readFile(`./texts/${file}`, "utf8", function(error, data) {
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

      let embed = new Discord.MessageEmbed({
        title: argument,
        description: fileSection
      });

      message.channel.send(embed);
    }
  });
};

let calcCommand = function(expression, message) {
  try {
    let result = mexp.eval(expression);

    message.channel.send(result);
  } catch (e) {
    message.channel.send(
      "Couldn't calculate that. Expression parser says: *" + e.message + "*"
    );
  }
};

let diceRollCommand = function(diceInput, message) {
  if (message.content.includes("*")) {
    let splitDiceInput = diceInput.split("*");

    let numSides = splitDiceInput[0];
    let numRolls = splitDiceInput[1];

    console.log(numSides);
    console.log(numRolls);

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

      message.channel.send(
        "Roll results: " + dieResults.toString() + "\nTotal: " + dieTotal
      );
    } else {
      message.channel.send(
        "The number of sides must be provided as a number greater than 1."
      );
    }
  } /*if (message.content.includes("+"))*/ else {
    let splitDiceInput = diceInput.split("+");

    let rolls = [];
    let dieTotal = 0;

    for (let i = 0; i < splitDiceInput.length; i++) {
      let numSides = splitDiceInput[i];
      if (numSides && !isNaN(numSides) && numSides > 1) {

        let thisRoll = getRandomInt(1, numSides);
        rolls.push(thisRoll);
        dieTotal += thisRoll;
      } else {
        message.channel.send(
          "The number of sides must be provided as a number greater than 1."
        );
      }
    }

    if (rolls.length > 1) {
      message.channel.send(
        "Roll results: " + rolls.join(",") + "\nTotal: " + dieTotal
      );
    } else {
      message.channel.send("Roll result: " + dieTotal);
    }
  }
};

let diceRollCommand2d6 = function(numInput, message) {
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
  dieResults.push(getRandomInt(1, 6)); // first roll
  dieResults.push(getRandomInt(1, 6)); // second roll
  // set total
  dieTotal = dieResults[0] + dieResults[1];

  let resultTotal = dieTotal + numToAdd;

  let rollMessage =
    "Roll results: " + dieResults.toString() + "\nTotal:\t" + dieTotal;
  if (numToAdd != 0) {
    rollMessage += " + " + numToAdd + " = " + resultTotal;
  }

  message.channel.send(rollMessage);
};

// Random integer function
let getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

client.login(process.env.SECRET);

client.on("ready", ()=>{
  client.user.setActivity("Artist Credit @myvariantart", {
    type: "PLAYING",
  });
})
