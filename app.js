console.log("version 18/02/21 16:10");
// Global variables
let interval, timer;

//DOM elements
const startBtn = document.querySelector("#start-btn");
const soundBtn = document.querySelector("#sound-icon");
const welcomeMessage = document.querySelector("header h2");
const letters = document.querySelectorAll("#letters button");
const secretWord = document.querySelector("#secret-word");
const messageBox = document.querySelector("#message-box");
const hangmanImage = document.querySelector("#hangman img");
const timerP = document.querySelector("#timer");
const guessP = document.querySelector("#guesses");
//audio
const audio = new Audio("./sounds/a-witch-monty-python.mp3");

const hangmanGame = {
  dictionnary: ["PUMPKIN", "BROOMSTICK"],
  wordToGuess: "",
  wrongGuessCount: 5,
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
    "./img/hangman6witch.png",
  ],
  time: 20,
  startGame() {
    hangmanGame.resetGame();
    hangmanGame.pickAWord();
    hangmanGame.displaySecretWord();
    interval = hangmanGame.setTimer();
    timer = hangmanGame.endTimer();
    audio.src = "./sounds/clock-ticking.mp3";
    audio.play();
    hangmanGame.displayGuesses();
    // set an event listner on each letter button
    letters.forEach((letter) =>
      letter.addEventListener("click", selectLetter, { once: true })
    );
  },
  setTimer() {
    // prints the time countdown
    timerP.style.display = "block";
    return setInterval(() => {
      timerP.innerHTML = `${this.time} sec and`;
      this.time--;
    }, 1000);
  },
  endTimer() {
    // stop the timer after 20sec and end the game
    // display timer message and remove guesses display
    return setTimeout(() => {
      clearInterval(interval);
      timerP.innerHTML = `Time is up, you're transformed into a hanging witch!`;
      guessP.style.display = "none";
      this.hangStatus = 6;
      this.isDeadOrSafe();
    }, 20000);
  },
  pickAWord() {
    // pick a random index of the dictionnary and take the word at this index out to store it in wordToGuess
    if (this.dictionnary.length === 0) {
      alert("No more words to guess! The page will reload.");
      return document.location.reload();
    }
    let index = Math.floor(Math.random() * this.dictionnary.length);
    this.wordToGuess = this.dictionnary.splice(index, 1).join("");
  },
  displaySecretWord() {
    // display a string of underscores to show how many letters are to be guessed
    secretWord.style.display = "block";
    secretWord.textContent = this.wordDisplay = this.wordToGuess.replace(
      /[A-Z]/g,
      "_"
    );
  },
  displayGuesses() {
    // show how many wrong guesses are allowed
    if (this.wrongGuessCount <= 0) {
      guessP.classList.add("shake");
      guessP.innerHTML = `no more wrong guesses left!`;
    } else {
      guessP.innerHTML = `${this.wrongGuessCount} wrong guesses left!`;
    }
  },
  compareLetter(letter) {
    // compare picked letter to each letter in wordToGuess & return a string to update the display of secretWord
    // if no letter matches increment hangStatus & decrease wrongGuessCount
    this.previousWordDisplay = this.wordDisplay;
    this.wordDisplay = this.wordDisplay.split("");
    for (let i = 0; i < this.wordToGuess.length; i++) {
      if (letter === this.wordToGuess[i]) this.wordDisplay[i] = letter;
    }
    this.wordDisplay = this.wordDisplay.join("");
    if (this.wordDisplay === this.previousWordDisplay) {
      this.hangStatus++;
      this.wrongGuessCount--;
      this.displayGuesses();
    }
    this.pictureChange();
    this.isDeadOrSafe();
    return this.wordDisplay;
  },
  pictureChange() {
    hangmanImage.src = this.hangmanImages[this.hangStatus];
  },
  isDeadOrSafe() {
    // check if game is over and if so display message and button to start over
    // + stop the timer & remove event listener on letters
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
    // if dead because of 6 wrong guesses: remove timer and display wrong guess message
    if (this.wrongGuessCount < 0) {
      timerP.style.display = "none";
      guessP.innerHTML =
        "Two many wrong guesses, you're transformed into a hanging witch!";
    }
    if (this.hangStatus === 6) {
      messageBox.innerHTML = `Sorry you are dead ! The magic word was <span class="highlight">${this.wordToGuess}</span>. Try again?`;
      this.pictureChange();
      hangmanImage.classList.add("hang");
      audio.src = "./sounds/a-witch-monty-python.mp3";
      audio.play();
      return true;
    }
  },
  isSafe() {
    if (this.wordDisplay === this.wordToGuess) {
      timerP.innerHTML = "Well done!";
      guessP.style.display = "none";
      secretWord.classList.add("blink");
      messageBox.innerHTML = `<span class="highlight">Fly Witch, Fly!</span><br>You have found the magic word...for now.<br>Try again?`;
      hangmanImage.classList.add("fly");
      hangmanImage.src = "./img/flying-witch2.png";
      audio.src = "./sounds/witch-laugh.mp3";
      audio.play();
      return true;
    }
  },
  resetGame() {
    timerP.innerHTML = `20 sec and`;
    guessP.style.display = "block";
    guessP.classList.remove("shake");
    secretWord.classList.remove("blink");
    hangmanImage.classList.remove("fly");
    hangmanImage.classList.remove("hang");
    startBtn.style.display = "none";
    messageBox.style.display = "none";
    letters.forEach((letter) => letter.classList.remove("selected"));
    this.wrongGuessCount = 5;
    this.wordDisplay = "";
    this.previousWordDisplay = "";
    this.hangStatus = 0;
    this.time = 19;
    this.pictureChange();
  },
};

// event handler for letters clicked : add class .selected and run compare function
function selectLetter(event) {
  event.target.classList.add("selected");
  secretWord.textContent = hangmanGame.compareLetter(event.target.textContent);
}
// event handler for sound : toggle icon src and mute prop
function soundHandler(evt) {
  if (!audio.muted) {
    evt.target.src = "./img/sound-icon-mute.png";
    audio.muted = true;
  } else {
    evt.target.src = "./img/sound-icon.png";
    audio.muted = false;
  }
}

// global event listeners : start button, sound button
startBtn.addEventListener("click", hangmanGame.startGame);
soundBtn.addEventListener("click", soundHandler);
