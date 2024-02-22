///////////////////// Import & export ///////////////////
import readline from "readline";
import { createInterface } from "readline";
import readlineSync from "readline-sync";
import keypress from "keypress";

import {
  mainMenuTemplate,
  introTemplate,
  outroTemplate,
} from "./data/templates.js";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { col } from "./data/colors.js";
import gradient from "gradient-string";

export let scores = [
  { name: "Honza", wpm: 60 },
  { name: "Monica", wpm: 120 },
  { name: "guest123", wpm: 20 },
];

//////////////////// Declare global variables /////////////////

let playerFirst;
let playerSecond;
let playerThird;
let champions;
let playerNew = {};
let textSample = "";

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

function fetchHighscoreTemplate() {
  return `_____________________________________________
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
|___________________________________________|`;
}

function displayHighscore() {
  playerFirst = fetchHighscore()[0];
  playerSecond = fetchHighscore()[1];
  playerThird = fetchHighscore()[2];
  let highscoreTemplate = fetchHighscoreTemplate();
  chalkAnimation.rainbow(highscoreTemplate, 0.5);
}

function checkHighscore() {
  fetchHighscore();
  if (champions[0] === playerNew) {
    console.log(
      `\u2728\u2728 Congratulations, ${playerNew.name}! You are the new winner! \u2728\u2728`
    );
  } else if (champions[1] === playerNew) {
    console.log(
      `\u2728 Congratulations, ${playerNew.name}! You made it to second place! \u2728`
    );
  } else if (champions[2] === playerNew) {
    console.log(
      `\u2728 Congratulations, ${playerNew.name}! You made it to the podium. \u2728`
    );
  } else {
    console.log(
      `You did not make it to the podium, ${playerNew.name}. Try again!`
    );
  }
}

function goBackToMenu() {
  console.log(`\n${col.y}[Enter] ${col.res}Return to Menu`);
  readlineSync.question("", { hideEchoBack: true, mask: "" });
  console.clear();
  startProgramm();
}

class Game {
  constructor() {}

  fetchRandomText() {
    let textArray = [
      "Hunt and peck (two-fingered typing), also known as Eagle Finger, is a common form of typing in which the typist presses each key individually.",
      "Instead of relying on the memorized position of keys, the typist must find each key by sight.",
      "Use of this method may also prevent the typist from being able to see what has been typed without glancing away from the keys.",
      "Although good accuracy may be achieved, any typing errors that are made may not be noticed immediately due to the user not looking at the screen.",
      "There are many idiosyncratic typing styles in between novice-style 'hunt and peck' and touch typing.",
      "Some use just two fingers, while others use 3-6 fingers.",
      "Words per minute (WPM) is a measure of typing speed, commonly used in recruitment.",
      "For the purposes of WPM measurement a word is standardized to five characters or keystrokes.",
      "The benefits of a standardized measurement of input speed are that it enables comparison across language and hardware boundaries.",
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

    // textSample = this.fetchRandomText();
    // später wieder einkommentieren:
    textSample =
      "Hunt and peck (two-fingered typing) is also known as Eagle Finger.";

    console.clear();
    console.log(`${col.y}[Esc]${col.res} Return to Menu`);
    console.log(col.b, `\n${textSample}\n`, col.res);
    console.log(
      "Ready to type the above text? Once you start typing, the clock will be ticking!\n"
    );

    this.typingTest();
  }

  async typingTest() {
    try {
      let startTimestamp;

      // Starten Sie die Tastatureingabe
      process.stdin.setRawMode(true);
      process.stdin.resume();

      // Fügen Sie einen Listener für das SIGINT-Ereignis hinzu, wenn noch keiner vorhanden ist
      if (!process.listenerCount("SIGINT")) {
        process.on("SIGINT", function () {
          console.log("\nExiting...");
          // Stellen Sie die Standardtastatureingabe wieder her
          process.stdin.setRawMode(false);
          process.exit();
        });
      }

      // Starten Sie die Tastatureingabe
      keypress(process.stdin);

      // Speichern Sie den aktuellen Text, der mit textSample verglichen wird
      let currentText = "";

      // Starten Sie das Vergleichen des eingegebenen Textes mit textSample
      process.stdin.on("keypress", function (letter, key) {
        if (!startTimestamp) {
          // Setzen Sie den Startzeitstempel, wenn der erste Buchstabe eingegeben wird
          startTimestamp = new Date();
        }
        if (key && key.name === "backspace") {
          // Wenn Backspace gedrückt wird, löschen Sie den letzten Buchstaben
          currentText = currentText.slice(0, -1);
        } else if (key && key.name === "escape") {
          // Überprüfen, ob die Escape-Taste gedrückt wurde
          process.stdin.pause();
          process.stdin.removeAllListeners("keypress");
          console.clear();
          console.log("Game was terminated with 'Esc'.");
          goBackToMenu();
        } else if (key && key.ctrl && key.name === "c") {
          // Überprüfen, ob "Strg + C" gedrückt wurde
          process.exit();
        } else {
          // Fügen Sie den neuen Buchstaben zum aktuellen Text hinzu
          currentText += letter;
        }

        // Löschen Sie die letzte Zeile
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);

        // Überprüfen, ob der aktuelle Text mit einem Teil des textSample übereinstimmt
        let outputText = "";
        for (let i = 0; i < currentText.length; i++) {
          if (textSample[i] === currentText[i]) {
            outputText += chalk.green(currentText[i]);
          } else {
            outputText += chalk.bgRed(currentText[i]);
          }
        }

        // Drucken Sie den aktuellen Text, damit der Benutzer ihn sehen kann
        process.stdout.write(outputText);

        // Überprüfen, ob der aktuelle Text mit textSample übereinstimmt
        if (currentText === textSample) {
          let endTimestamp = new Date();
          process.stdin.pause();
          process.stdin.removeAllListeners("keypress");
          console.clear();
          let totalTime = (endTimestamp - startTimestamp) / 60000; // duration in minutes
          let words = currentText.length / 5; // number of words is usually approximated by entries divided by five
          let wordsPerMinute = Math.round(words / totalTime);
          console.log(
            `Done! Your average typing speed is: ${chalk.bgMagentaBright(
              wordsPerMinute
            )} words per minute.\n`
          );
          // Weitere Verarbeitung des Ergebnisses (z.B. Anzeige von Highscore, etc.)
          playerNew.wpm = wordsPerMinute;
          scores.push(playerNew);

          checkHighscore();
          displayHighscore();
          setTimeout(() => {
            goBackToMenu();
          }, 2000);
        }
      });

      // Beenden Sie das Programm, wenn "Ctrl + C" gedrückt wird
      process.on("SIGINT", function () {
        process.exit();
      });
    } catch (error) {
      console.log("An error occured.");
      process.stdin.pause();
      process.stdin.removeAllListeners("keypress");
      goBackToMenu();
    }
  }
}

class Player {
  constructor(name, wpm) {
    this.name = name;
    this.wpm = wpm;
  }
}

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
      displayHighscore();
      setTimeout(() => {
        goBackToMenu();
      }, 2000);
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

//////////////// Start the Programm ///////////////////

console.clear();
// chalkAnimation.karaoke(introTemplate, 1.6);

// setTimeout(() => {
//   console.clear();
//   console.log(gradient("orange", "hotpink")(introTemplate));
// }, 2300);

// setTimeout(() => {
//   console.clear();
// }, 3400);

// setTimeout(() => {
//   console.clear();
//   startProgramm();
// }, 4000); // after 4 seconds, the menu appears

// temporary only:
startProgramm();
