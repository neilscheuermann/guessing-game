//Generate a random number between 1 and 100.
function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
};

//Shuffles an array into a random order.
function shuffle(arr) {
  var m = arr.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

class Game {
  constructor() {
    this.winningNumber = generateWinningNumber();
    this.dummyNum1 = generateWinningNumber();
    this.dummyNum2 = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
    this.hasWon = false;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return (this.playersGuess < this.winningNumber);
  }

  playersGuessSubmission(num) {
    if (num < 1 || num > 100 || isNaN(num)) return 'That is an invalid guess.';
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess() {
    if (this.pastGuesses.includes(this.playersGuess)) return 'You already guessed that number.';
    this.pastGuesses.push(this.playersGuess);
    if (this.playersGuess === this.winningNumber) {
      this.hasWon = true;
      return `You Win! The number was ${this.winningNumber}.`;
    }
    if (this.pastGuesses.length >= 5) return `You Lose. The number was ${this.winningNumber}.`;
    if (this.difference() < 5) return `You're burning up!!! (within 5)`;
    if (this.difference() < 10) return `You're hot! (within 10)`;
    if (this.difference() < 25) return `You're warm. (within 25)`;
    if (this.difference() < 50) return `You're a bit chilly. (within 50)`;
    if (this.difference() < 100) return `You're ice cold! (within 100)`;
  }

  provideHint() {
    const arr = [this.winningNumber, this.dummyNum1, this.dummyNum2];
    return shuffle(arr).join(', ');
  }
}

const newGame = () => new Game;

//Sets the game object when the page is re-loaded.
let currentGame = newGame();

const input = document.getElementById('input');
const submitButton = document.getElementById('submit-btn');
const hintButton = document.getElementById('hint-btn');
const resetButton = document.getElementById('reset-btn');
const header = document.getElementById('header');
const subHeader = document.getElementById('sub-header');
const guess1 = document.getElementById('guess1');
const guess2 = document.getElementById('guess2');
const guess3 = document.getElementById('guess3');
const guess4 = document.getElementById('guess4');
const guess5 = document.getElementById('guess5');
const hint = document.getElementById('hint');
const guesses = document.querySelectorAll('.guesses');
const bodyDiv = document.getElementById('bodyDiv');

console.log(guesses);

//Get the value from the number input box.
const getInputAndClear = inputElement => {
  const number = parseInt(inputElement.value);
  inputElement.value = '';
  return number;
};

const submitGuess = () => {
  const num = getInputAndClear(input);
  const mainMessage = currentGame.playersGuessSubmission(num);

  //sets the header message after each guess.
  header.innerHTML = mainMessage;

  //Assigns the past guesses to the guesses boxes in HTML webpage.
  if (currentGame.pastGuesses[0]) guess1.innerHTML = currentGame.pastGuesses[0];
  if (currentGame.pastGuesses[1]) guess2.innerHTML = currentGame.pastGuesses[1];
  if (currentGame.pastGuesses[2]) guess3.innerHTML = currentGame.pastGuesses[2];
  if (currentGame.pastGuesses[3]) guess4.innerHTML = currentGame.pastGuesses[3];
  if (currentGame.pastGuesses[4]) guess5.innerHTML = currentGame.pastGuesses[4];

  //Sets the sub-header message after each guess.
  if (header.innerHTML.includes('You Win!') || header.innerHTML.includes('You Lose')) subHeader.innerHTML = `RESET to play again`;
  // else if (header.innerHTML === `You Lose.`) subHeader.innerHTML = `The number was ${currentGame.winningNumber}`;
  else if (header.innerHTML === 'You already guessed that number.' || header.innerHTML === 'That is an invalid guess.') subHeader.innerHTML = `Guess a number between 1 and 100.`;
  else if (currentGame.isLower()) subHeader.innerHTML = `Guess higher.`;
  else if (!currentGame.isLower()) subHeader.innerHTML = `Guess lower.`;

  //Disable the submit and hint button after winning or losing.
  if (currentGame.hasWon || currentGame.pastGuesses.length >= 5) {
    submitButton.disabled = true;
    input.disabled = true;
  }
};

//Runs sumbitGuess() each time the submit button is clicked.
submitButton.addEventListener('click', submitGuess);

//Runs submitGuess() each time enter is pushed after entering info into the number-guess box.
input.addEventListener('keyup', function(event) {
  if (currentGame.hasWon || currentGame.pastGuesses.length >= 5) return;
  if (event.keyCode === 13) submitGuess();
});

//Provides the hint each time the hint button is pushed.
hintButton.addEventListener('click', function() {
  hint.innerHTML === 'Guesses' ? hint.innerHTML = `The winning number is one of the following: ${currentGame.provideHint()}.` : hint.innerHTML = 'Guesses';
});

//Manually resets the text content to original values.
resetButton.addEventListener('click', function() {

  subHeader.textContent = "Guess a number between 1 and 100.";
  header.textContent = "GUESSING GAME";
  for (let i = 0; i < guesses.length; i++) {
    guesses[i].textContent = '_';
  }

  submitButton.disabled = false;
  input.disabled = false;

  hint.innerHTML = 'Guesses';

  currentGame = newGame();
});
