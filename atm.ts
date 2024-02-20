import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

interface User {
  id: string;
  pin: string;
  balance: number;
}

const users: User[] = [];

function generateRandomUserData(): User {
  const id = Math.random().toString(36).substring(7);
  const pin = Math.random().toString().slice(2, 6);
  const balance = Math.floor(Math.random() * 10000) + 1000; // Random balance between 1000 and 10000
  return { id, pin, balance };
}

function createUser(): User {
  const user = generateRandomUserData();
  users.push(user);
  return user;
}

function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

function authenticateUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    rl.question('Enter user ID: ', (userId) => {
      rl.question('Enter PIN: ', (pin) => {
        const user = findUserById(userId);
        if (user && user.pin === pin) {
          resolve(user);
        } else {
          reject(new Error('Invalid credentials. Please try again.'));
        }
      });
    });
  });
}

function displayMenu(): void {
  console.log('\n1. Check Balance');
  console.log('2. Deposit');
  console.log('3. Withdraw');
  console.log('4. Exit');
}

async function startATM(): Promise<void> {
  try {
    console.log('Welcome to the ATM!');
    const user = await authenticateUser();
    console.log(`Welcome, User ${user.id}!`);

    while (true) {
      displayMenu();
      const choice = await askForChoice();
      switch (choice) {
        case '1':
          console.log(`Your current balance is $${user.balance}`);
          break;
        case '2':
          const depositAmount = await askForAmount('deposit');
          user.balance += depositAmount;
          console.log(`$${depositAmount} has been deposited successfully. Your new balance is $${user.balance}`);
          break;
        case '3':
          const withdrawAmount = await askForAmount('withdraw');
          if (withdrawAmount > user.balance) {
            console.log('Insufficient funds.');
          } else {
            user.balance -= withdrawAmount;
            console.log(`$${withdrawAmount} has been withdrawn successfully. Your new balance is $${user.balance}`);
          }
          break;
        case '4':
          console.log('Thank you for using the ATM. Goodbye!');
          rl.close();
          return;
        default:
          console.log('Invalid choice. Please try again.');
      }
    }
  } catch (error) {
    console.error(error.message);
    startATM();
  }
}

function askForChoice(): Promise<string> {
  return new Promise((resolve) => {
    rl.question('Enter your choice: ', (choice) => {
      resolve(choice);
    });
  });
}

function askForAmount(action: string): Promise<number> {
  return new Promise((resolve) => {
    rl.question(`Enter the amount you want to ${action}: $`, (amount) => {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        resolve(parsedAmount);
      } else {
        console.log('Invalid amount. Please enter a valid number.');
        resolve(0);
      }
    });
  });
}

createUser(); // Create a random user at the beginning

startATM();
