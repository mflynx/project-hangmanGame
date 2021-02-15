
const hangmanGame = {
    dictionnary : ["PUMPKIN","COMPUTER","SCHOOL","INTELLIGENT","COWBOY"],
    wordToGuess : "",
    guessCount : 0,
    wordDisplay : "",
    previousWordDisplay : "",
    hangStatus : 0,
    hangmanImages : ["./img/hangman0.png","./img/hangman1.png","./img/hangman2.png","./img/hangman3.png","./img/hangman4.png","./img/hangman5.png","./img/hangman6.png"],
    pickAWord() {
        // picks a random index of the dictionnary and takes the word at this index out to store it in wordToGuess
        if (this.dictionnary.length===0) return alert("sorry, no more words to guess!");
        let index = Math.floor(Math.random()*(this.dictionnary.length));
        this.wordToGuess = this.dictionnary.splice(index,1).join("");
        console.log(this.wordToGuess);
    },
    displaySecretWord() {
        // returns a string of underscores to show how many letters are to be guessed (will be displayed in id ="secret-word")
        return this.wordDisplay = this.wordToGuess.replace(/[A-Z]/g, "_");
    },
    compareLetter(letter) {
        // compares letter to each letter in wordToGuess & returns a string to update the display of secretWord
        // increments hangStatus if no letter matches
        this.guessCount ++;
        this.previousWordDisplay = this.wordDisplay;
        this.wordDisplay = this.wordDisplay.split("");
        for (let i=0; i<this.wordToGuess.length; i++) {
            if (letter===this.wordToGuess[i]) this.wordDisplay[i] = letter ;
        } 
        this.wordDisplay = this.wordDisplay.join("");
        if (this.wordDisplay===this.previousWordDisplay) {this.hangStatus++};
        this.pictureChange();
        this.isDeadOrSafe();
        console.log(this.hangStatus);
        return this.wordDisplay;
    },
    pictureChange(){ 
        hangmanImage.src = this.hangmanImages[this.hangStatus];
    },
    isDeadOrSafe(){
        // checks if game is over and if so prints message ---removes event listener ???
        if (this.hangStatus===6) {
            messageBox.innerHTML = "Sorry you are dead ! Try again?";
            messageBox.style.display = "block";
            startBtn.style.display = "block";
            // letters.forEach(letter=>letter.removeEventListener("click", selectLetter));
        } else if (this.wordDisplay===this.wordToGuess) {
            messageBox.textContent = "Well done! You've escaped!...for now.<br>Try again?";
            messageBox.style.display = "block";
            startBtn.style.display = "block";
            hangmanImage.src = "./img/happy.png"
            // letters.forEach(letter=>letter.removeEventListener("click", selectLetter));
        }
    }
}


//DOM elements
const startBtn = document.querySelector("header button");
const letters = document.querySelectorAll("#letters button");
const secretWord = document.querySelector("#secret-word");
const messageBox = document.querySelector("#message-box");
const hangmanImage = document.querySelector("#hangman img");

// event listeners : start button, letters 
startBtn.addEventListener("click",startGame);



//================game starts here 
function startGame(){
    //reset game
    hangmanGame.guessCount = 0;
    hangmanGame.wordDisplay = "";
    hangmanGame.previousWordDisplay = "";
    hangmanGame.hangStatus = 0;
    letters.forEach(letter=>letter.classList.remove("selected"));
    startBtn.style.display = "none";
    messageBox.style.display = "none";

    hangmanGame.pickAWord();
    secretWord.textContent = hangmanGame.displaySecretWord();

//works only once on each letter button -> adds class .selected and runs compare function
letters.forEach(letter=>letter.addEventListener("click",function selectLetter() {
    letter.classList.add("selected");
    secretWord.textContent = hangmanGame.compareLetter(letter.textContent);
    console.log(hangmanGame);
},{once : true}));

}







