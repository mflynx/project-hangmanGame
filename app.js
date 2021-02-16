// Global variables
let interval, timer;

//DOM elements
const startBtn = document.querySelector("header button");
const soundBtn = document.querySelector("#sound-icon")
const welcomeMessage = document.querySelector("header h2");
const letters = document.querySelectorAll("#letters button");
const secretWord = document.querySelector("#secret-word");
const messageBox = document.querySelector("#message-box");
const hangmanImage = document.querySelector("#hangman img");
const timerP = document.querySelector("#left-panel p");
//audio
const audio = new Audio("./sounds/a-witch-montyPython.mp3");
const clockTick = new Audio("./sounds/clock-ticking.mp3");
// const witchLaugh = new Audio("./sounds/witch-laugh.mp3");


const hangmanGame = {
  dictionnary: ["PUMPKIN", "COMPUTER", "SCHOOL", "INTELLIGENT", "COWBOY"],
  wordToGuess: "",
  guessCount: 0,
  wordDisplay: "",
  previousWordDisplay: "",
  hangStatus: 0,
  hangmanImages: [
    "./img/hangman0.png",
    "./img/hangman1.png",
    "./img/hangman2.png",
    "./img/hangman3.png",
    "./img/hangman4.png",
    "./img/hangman5.png",
    "./img/hangman6.png",
  ],
  time: 7,
  startGame() {
    hangmanGame.resetGame();
    hangmanGame.pickAWord();
    hangmanGame.displaySecretWord();
    interval = hangmanGame.setTimer();
    timer = hangmanGame.endTimer();
    // sets an event listner on each letter button
    letters.forEach((letter) =>
      letter.addEventListener("click", selectLetter, { once: true })
    );
  },
  setTimer() {
    // prints a timer set to 15sec
    timerP.style.display = "block";
    return setInterval(() => {
      timerP.innerHTML = `${this.time} seconds left!`;
      this.time--;
    }, 1000);
  },
  endTimer() {
    // stops the timer after 15sec and ends the game
    return setTimeout(() => {
      clearInterval(interval);
      timerP.innerHTML = `Time is up, witch !`;
      this.hangStatus = 6;
      this.isDeadOrSafe();
    }, 8000);
  },
  pickAWord() {
    // picks a random index of the dictionnary and takes the word at this index out to store it in wordToGuess
    if (this.dictionnary.length === 0)
      return alert("sorry, no more words to guess!");
    let index = Math.floor(Math.random() * this.dictionnary.length);
    this.wordToGuess = this.dictionnary.splice(index, 1).join("");
    console.log(this.wordToGuess);
  },
  displaySecretWord() {
    // returns a string of underscores to show how many letters are to be guessed (will be displayed in id ="secret-word")
    secretWord.style.display = "block";
    secretWord.textContent = (this.wordDisplay = this.wordToGuess.replace(/[A-Z]/g, "_"));
  },
  compareLetter(letter) {
    // compares letter to each letter in wordToGuess & returns a string to update the display of secretWord
    // increments hangStatus if no letter matches
    this.guessCount++;
    this.previousWordDisplay = this.wordDisplay;
    this.wordDisplay = this.wordDisplay.split("");
    for (let i = 0; i < this.wordToGuess.length; i++) {
      if (letter === this.wordToGuess[i]) this.wordDisplay[i] = letter;
    }
    this.wordDisplay = this.wordDisplay.join("");
    if (this.wordDisplay === this.previousWordDisplay) {
      this.hangStatus++;
    }
    this.pictureChange();
    this.isDeadOrSafe();
    console.log(this.hangStatus);
    return this.wordDisplay;
  },
  pictureChange() {
    hangmanImage.src = this.hangmanImages[this.hangStatus];
  },
  isDeadOrSafe() {
    // checks if game is over and if so displays message and button to start over
    // + stops the timer & removes event listener
    if (this.isDead() || this.isSafe()) {
      messageBox.style.display = "block";
      startBtn.style.display = "block";
      letters.forEach((letter) =>
        letter.removeEventListener("click", selectLetter)
      );
      clearInterval(interval);
      clearTimeout(timer);
    }
  },
  isDead() {
    if (this.hangStatus === 6) {
      messageBox.innerHTML = `Sorry you are dead ! The magic word was <span>${this.wordToGuess}</span>. Try again?`;
      this.pictureChange();
      return true;
    }
  },
  isSafe() {
    if (this.wordDisplay === this.wordToGuess) {
      messageBox.textContent =
        "Well done! You've escaped!...for now. Try again?";
      hangmanImage.src = "./img/flying-witch.png";
      return true;
    }
  },
  resetGame() {
    timerP.style.display = "none";
    startBtn.style.display = "none";
    messageBox.style.display = "none";
    welcomeMessage.style.display = "none";
    // angryCrowdSound.
    letters.forEach((letter) => letter.classList.remove("selected"));
    this.guessCount = 0;
    this.wordDisplay = "";
    this.previousWordDisplay = "";
    this.hangStatus = 0;
    this.time = 7;
  },
};


// event handler for letters clicked : adds class .selected and runs compare function
function selectLetter(event) {
  event.target.classList.add("selected");
  secretWord.textContent = hangmanGame.compareLetter(event.target.textContent);
  console.log(hangmanGame);
}
// event handler for sound : toggle icon src and mute prop
function soundHandler(evt) {
  console.log(audio);
  if (evt.target.src==="http://localhost:3000/img/sound-icon.png") { //*****to be changed
    evt.target.src = "./img/sound-icon-mute.png";
    audio.volume=0;
  } else {
    evt.target.src = "./img/sound-icon.png";
    audio.volume=1;
  }
}

// global event listeners : start button, sound button
startBtn.addEventListener("click", hangmanGame.startGame);
soundBtn.addEventListener("click",soundHandler);

//enable audio + loop
audio.loop=true;
// audio.play();