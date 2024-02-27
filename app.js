///////////////////// Import & export ///////////////////

// node packages
import readline from "readline";
import readlineSync from "readline-sync";
import keypress from "keypress";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import gradient from "gradient-string";

// Templates & colors
import {
  mainMenuTemplate,
  introTemplate,
  outroTemplate,
} from "./data/templates.js";
import { col } from "./data/colors.js";

//////////////////// Declare global variables /////////////////

let scores = [
  { name: "Dummy1", wpm: 90 },
  { name: "Dummy2", wpm: 50 },
  { name: "Dummy3", wpm: 25 },
];

let playerFirst;
let playerSecond;
let playerThird;
let champions;
let playerNew = {};
let textSample = "";

//////////////////// Functions for highscore (global) /////////////////

function fetchHighscore() {
  let highscore = [...scores];
  highscore.sort((player1, player2) => {
    return player2.wpm - player1.wpm;
  });
  champions = highscore.slice(0, 3);
  let highscoreLog = champions.map(
    (player, index) =>
      `${index + 1}.\t${player.name}:  ${player.wpm} words per minute`
  );
  return highscoreLog;
}

function mark(i) {
  let highscoreLog = fetchHighscore();
  if (champions[i] === playerNew) {
    return chalk.bgGreenBright(highscoreLog[i]);
  } else return highscoreLog[i];
}

function fetchHighscoreTemplate() {
  return `
_____________________________________________
|                                           |
|             \u2726\u2726\u2726  Highscore  \u2726\u2726\u2726           |
|___________________________________________|
|                                           |
|                                           |
|  ${mark(0)}\t    |          
|                                           |
|  ${mark(1)}\t    |       
|                                           |
|  ${mark(2)}\t    |                
|                                           |             
|___________________________________________|
`;
}

function basicHighscoreTemplate() {
  return `
_____________________________________________
|                                           |
|             \u2726\u2726\u2726  Highscore  \u2726\u2726\u2726           |
|___________________________________________|
|                                           |
|                                           |
|  ${playerFirst}\t    |          
|                                           |
|  ${playerSecond}\t    |       
|                                           |
|  ${playerThird}\t    |                
|                                           |             
|___________________________________________|
`;
}

function displayHighscore() {
  playerFirst = fetchHighscore()[0];
  playerSecond = fetchHighscore()[1];
  playerThird = fetchHighscore()[2];
  let highscoreTemplate = fetchHighscoreTemplate();
  console.log(highscoreTemplate);
}

function checkHighscore() {
  fetchHighscore();
  if (champions[0] === playerNew) {
    console.log(
      gradient(
        "orange",
        "hotpink"
      )(
        `\u2728\u2728 Congratulations, ${playerNew.name}! You are the new winner! \u2728\u2728`
      )
    );
  } else if (champions[1] === playerNew) {
    console.log(
      gradient(
        "orange",
        "hotpink"
      )(
        `\u2728 Congratulations, ${playerNew.name}! You made it to second place! \u2728`
      )
    );
  } else if (champions[2] === playerNew) {
    console.log(
      gradient(
        "orange",
        "hotpink"
      )(
        `\u2728 Congratulations, ${playerNew.name}! You made it to the podium. \u2728`
      )
    );
  } else {
    console.log(
      col.b,
      `You did not make it to the podium, ${playerNew.name}. Try again!`,
      col.res
    );
  }
}

//////////////////// Global functions /////////////////

// function startProgramm

function startProgramm() {
  const mainMenu = readlineSync.question(mainMenuTemplate);

  switch (mainMenu.toUpperCase()) {
    case "N":
      console.clear();
      let game1 = new Game();
      game1.startNewGame();
      break;

    case "H":
      console.clear();
      playerFirst = fetchHighscore()[0];
      playerSecond = fetchHighscore()[1];
      playerThird = fetchHighscore()[2];
      chalkAnimation.rainbow(basicHighscoreTemplate());
      setTimeout(() => {
        goBackToMenu();
      }, 2200);
      break;

    case "Q":
      console.clear();
      console.log(col.b, `\nGoodbye for now!`, col.res);
      console.log(gradient("blue", "hotpink")(outroTemplate));
      process.exit(0);

    default:
      console.clear();
      console.log("Invalid input. Choose another key.");
      startProgramm();
      break;
  }
}

function goBackToMenu() {
  console.log(`\n${col.y}[Enter] ${col.res}Return to Menu`);
  readlineSync.question("", { hideEchoBack: true, mask: "" });
  console.clear();
  startProgramm();
}

//////////////////// Classes (Game, Player) /////////////////

// class Game

class Game {
  constructor() {}

  fetchRandomText() {
    let textArray = [
      "A touch typist does not need to move the sight between the keyboard (that is obscured with fingers and may be poorly lit) and other areas that require attention.",
      "Typing speed generally improves with practice. While practicing, it is important to ensure that there are no weak keys.",
      "Typing speed is typically determined by how slow these weak keys are typed rather than how fast the remaining keys are typed.",
      "For example, many hunt-and-peck typists have the keyboard layout memorized and are able to type while focusing their gaze on the screen.",
      "A Microsoft survey suggested that many managers expect employees to be able to type at a minimum of 50 WPM.",
      "Original layouts for the first few mechanical typewriters were in alphabetical order (ABCDE etc.)",
      "Speeds average around 30-40 WPM (words per minute), while a speed of 60-80 WPM is the approximate speed to keep up with one's thoughts.",
      "Many hunt-and-peck typists have the keyboard layout memorized and are able to type while focusing their gaze on the screen.",
      // source of all quotes: wikipedia.org
    ];
    let randomIndex = Math.floor(Math.random() * textArray.length);
    return textArray[randomIndex];
  }

  startNewGame() {
    console.clear();
    console.log("Enter your name: \n", col.g);
    let nameInput = readlineSync.question("");
    let playerName = nameInput ? nameInput : "Guest";
    playerNew = new Player(playerName, 0);

    // replace this text later with the real textSample:
    // textSample = "Some very short example text.";
    textSample = this.fetchRandomText();
    // remark: code works only for one-liners so far. could be extended two multiple-line text snippets though (via comparing textSample.length to process.stdout.columns)

    console.clear();
    console.log(`${col.y}[Esc]${col.res} Return to Menu`);
    console.log(col.b, `\n\n${textSample}\n\n`, col.res);
    console.log(
      "Ready to type the above text? Once you start typing, the clock will be ticking!\n"
    );

    this.typingTest();
  }

  typingTest() {
    let startTimestamp;

    // start entry via keyboard:
    // set RawMode: do not wait for "return" key to be pressed (listen to each keyboard entry even without return)
    process.stdin.setRawMode(true);
    process.stdin.resume();
    keypress(process.stdin);

    let currentText = ""; // currentText (what has been typed so far)

    // repeat the following after every new key that is pressed:
    process.stdin.on("keypress", function (letter, key) {
      // when startTimestamp has not yet been set: set startTimestamp
      if (!startTimestamp) {
        startTimestamp = new Date();
      }

      // delete the last letter, when backspace is pressed:
      if (key && key.name === "backspace") {
        currentText = currentText.slice(0, -1);

        // terminate game and go back to menu, when escape is pressed:
      } else if (key && key.name === "escape") {
        process.stdin.pause();
        process.stdin.removeAllListeners("keypress");
        console.clear();
        console.log("Game was terminated with 'Esc'.");
        goBackToMenu();

        // add the new letter to the current text:
      } else {
        currentText += letter;
      }

      // delete the lastly typed line and set back the cursor (so that everything can be on the same line)
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);

      // compare currentText and the beginning of textSample; prepare all correct letters in green, all false letters with red background:
      let outputText = "";
      for (let i = 0; i < currentText.length; i++) {
        if (textSample[i] === currentText[i]) {
          outputText += chalk.green(currentText[i]);
        } else {
          outputText += chalk.bgRed(currentText[i]);
        }
      }

      // prints the currentText (but without returns and other formatting that console.log uses)
      process.stdout.write(outputText);

      // check if all of textSample has been typed yet --> if so: set endTimestamp, end all processes
      if (currentText === textSample) {
        let endTimestamp = new Date();

        // end the typing/listening process:
        process.stdin.pause();
        process.stdin.removeAllListeners("keypress");

        // calculate the total time, number of words and speed (in wmp):
        let totalTime = (endTimestamp - startTimestamp) / 60000; // duration in minutes
        let words = currentText.length / 5; // number of words is usually approximated by entries divided by five
        let wordsPerMinute = Math.round(words / totalTime);

        // print the speed to the console:
        console.clear();
        console.log(
          gradient(
            "orange",
            "hotpink"
          )(`\nDone! Average speed is being calculated.....`)
        );

        setTimeout(() => {
          console.clear();
          console.log(
            `\nYour average typing speed is: ${chalk.bgMagenta(
              wordsPerMinute
            )} words per minute.\n`
          );
          // set the players score, display highscore and menu-return-instruction:
          playerNew.wpm = wordsPerMinute;
          scores.push(playerNew);
          checkHighscore();
          displayHighscore();
          goBackToMenu();
        }, 3600);
      }
    });
  }
}

// class Player

class Player {
  constructor(name, wpm) {
    this.name = name;
    this.wpm = wpm;
  }
}

//////////////// Run the Programm ///////////////////

console.clear();
chalkAnimation.karaoke(introTemplate, 0.4);

setTimeout(() => {
  console.clear();
  console.log(gradient("orange", "hotpink")(introTemplate));
}, 7000);

setTimeout(() => {
  console.clear();
  startProgramm();
}, 9000); // after 9 seconds, the menu appears

// for debugging use only:
// startProgramm();
