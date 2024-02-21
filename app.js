import * as readline from "node:readline/promises";
import { createInterface } from "readline";
import readlineSync from "readline-sync";

import {
  mainMenuTemplate,
  introTemplate,
  outroTemplate,
} from "./data/templates.js";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { col } from "./data/colors.js";

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

export let scores = [
  { name: "Honza", wpm: 30 },
  { name: "Monica", wpm: 50 },
  { name: "guest123", wpm: 100 },
];

function fetchHighscore() {
  let highscore = [...scores];
  highscore.sort((player1, player2) => {
    return player2.wpm - player1.wpm;
  });
  let champions = highscore.slice(0, 3);
  let highscoreLog = champions.map(
    (player, index) =>
      `${index + 1}.\t${player.name}:  ${player.wpm} words per minute`
  );
  return highscoreLog;
}

const highscoreTemplate = `_____________________________________________
|                                           |
|             \u2726\u2726\u2726  Highscore  \u2726\u2726\u2726           |
|___________________________________________|
|                                           |
|                                           |
|  ${fetchHighscore()[0]}\t    |          
|  ${fetchHighscore()[1]}\t    |       
|  ${fetchHighscore()[2]}\t    |                
|                                           |             
|___________________________________________|
  `;

function displayHighscore() {
  chalkAnimation.rainbow(highscoreTemplate, 0.5);
}

function goBackToMenu() {
  if (
    readlineSync.keyIn("\n\nPress any key to return to Menu (except 'Enter').")
  ) {
    console.clear();
    startProgramm();
  }
}

class Game {
  constructor() {}

  fetchRandomText() {
    let textArray = [
      {
        text1:
          "Hunt and peck (two-fingered typing), also known as Eagle Finger, is a common form of typing in which the typist presses each key individually. Instead of relying on the memorized position of keys, the typist must find each key by sight. Use of this method may also prevent the typist from being able to see what has been typed without glancing away from the keys. Although good accuracy may be achieved, any typing errors that are made may not be noticed immediately due to the user not looking at the screen. There is also the disadvantage that because fewer fingers are used, those that are used are forced to move a much greater distance.",
      },
      {
        text2:
          "There are many idiosyncratic typing styles in between novice-style 'hunt and peck' and touch typing. For example, many 'hunt and peck' typists have the keyboard layout memorized and are able to type while focusing their gaze on the screen. Some use just two fingers, while others use 3-6 fingers. Some use their fingers very consistently, with the same finger being used to type the same character every time, while others vary the way they use their fingers.",
      },
      {
        text3:
          "Words per minute (WPM) is a measure of typing speed, commonly used in recruitment. For the purposes of WPM measurement a word is standardized to five characters or keystrokes. Therefore, 'brown' counts as one word, but 'accounted' counts as two. The benefits of a standardized measurement of input speed are that it enables comparison across language and hardware boundaries. The speed of an Afrikaans-speaking operator in Cape Town can be compared with a French-speaking operator in Paris. (Wikipedia)",
      },
    ];
    let randomIndex = Math.floor(Math.random() * 3);
    return Object.values(textArray[randomIndex])[0];
  }

  startNewGame() {
    console.clear();

    let nameInput = readlineSync.question("Enter your name: ");
    let playerName = nameInput ? nameInput : "Guest";
    let playerNew = new Player(playerName, 0);
    scores.push(playerNew);
    console.log(playerNew);

    // später einkommentieren:
    // let textSample = this.fetchRandomText();

    let textSample = "Dies";
    let startTimestamp = new Date();

    console.clear();
    console.log(col.b, `\n${textSample}\n`, col.res);

    // readline neu (als asynchrone Funktion, damit der Rest im Format ESM bleiben kann, für imports & Co)

    async function typingTest() {
      try {
        const readline = await import("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          "Type the text above and make sure to directly correct any mistakes you make. Once you have finished typing, press 'Enter'. Time is running! \n",
          async (input) => {
            let endTimestamp = new Date();

            if (input !== textSample) {
              console.clear();
              console.log("Your text was not fully correct. Game over.");
              goBackToMenu();
            } else {
              console.clear();
              let totalTime = (endTimestamp - startTimestamp) / 60000; // duration in minutes
              let words = textSample.split(" "); // number of words
              let wordsPerMinute = Math.round(words.length / totalTime);
              // hier noch eine Meldung einbauen, wenn der aktuelle highscore geknackt wurde
              console.log(
                `Congratulations! Your average typing speed is: ${wordsPerMinute} words per minute\n\nHighscore:\n`
              );
              playerNew.wpm = wordsPerMinute;
              displayHighscore();
              setTimeout(() => {
                goBackToMenu();
              }, 2000);
            }

            rl.close();
          }
        );
      } catch (error) {
        console.log("An error occured.");
        goBackToMenu();
      }
    }

    typingTest();

    // // old:
    // rl.question(
    //   "Type the text above and make sure to directly correct any mistakes you make. Once you have finished typing, press 'Enter'. Time is running! \n",
    //   function (input) {
    //     let endTimestamp = new Date();

    //     if (input !== textSample) {
    //       console.clear();
    //       console.log("Your text was not fully correct. Game over.");
    //     } else {
    //       console.clear();
    //       let totalTime = (endTimestamp - startTimestamp) / 60000; // duration in minutes
    //       let words = textSample.split(" "); // number of words
    //       let wordsPerMinute = Math.round(words.length / totalTime);
    //       // hier noch eine Meldung einbauen, wenn der aktuelle highscore geknackt wurde
    //       console.log(
    //         `Congratulations, ${playerNew.name}! Your average typing speed is: ${wordsPerMinute} words per minute

    //         Highscore:            `
    //       );
    //       playerNew.wpm = wordsPerMinute;
    //       displayHighscore();
    //     }

    //     rl.close();
    //   }
    // );
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
      console.log(col.y, `\nGoodbye for now!\n`, col.res);
      console.log(outroTemplate, "\n");
      process.exit(0);
      break;

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
//   console.log(col.y, introTemplate, col.res);
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
