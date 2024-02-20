import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playGame(rounds: number): void {
  let score = 0;

  function playRound(): void {
    const randomNumber = getRandomNumber(1, 100);

    rl.question('Guess the number between 1 and 100: ', (answer) => {
      const guessedNumber = parseInt(answer);

      if (isNaN(guessedNumber)) {
        console.log('Please enter a valid number.');
        playRound();
        return;
      }

      if (guessedNumber === randomNumber) {
        console.log('Congratulations! You guessed the number correctly.');
        score++;
      } else {
        console.log(`Wrong guess. The number was ${randomNumber}.`);
      }

      if (score < rounds) {
        playRound();
      } else {
        console.log(`Game over. Your score is ${score}/${rounds}.`);
        rl.close();
      }
    });
  }

  playRound();
}

const numberOfRounds = 3; // Change this to alter the number of rounds
playGame(numberOfRounds);
