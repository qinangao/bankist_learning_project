'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Computing Usernames
const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};
creatUsernames(accounts);

//Update UI function
const updateUI = function (acc) {
  //Display movement
  displayMovement(currentAccount.movements);
  //Display balance
  calcDisplayBalance(currentAccount);
  //Display summary
  calcDisplaySummary(currentAccount);
};

//Login

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submmiting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;
    //Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Display Movement
const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        
          <div class="movements__value">${mov} €</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((a, c) => a + c, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((a, c) => a + c, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((a, c) => a + c, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(n => n * acc.interestRate * 0.01)
    .reduce((a, c) => a + c, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Implementing Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance > amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});
//Request loan
//Rule: only grants a loan if there is at least one deposit
//with at least 10% of the request loan amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount / 10)
  ) {
    //Add amount
    currentAccount.movements.push(loanAmount);
    //Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});
//Delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    inputCloseUsername.value = inputClosePin.value = '';
    //Delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Slice
// let arr = ['a', 'b', 'c', 'd', 'e'];
// // console.log(arr.slice(2));
// // console.log(arr.slice(2, 4));
// // console.log(arr.slice(-2)); //last two element
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice());
// // console.log([...arr]);
// // //Splice: mutate the orginal array, lost the part that was extratced
// // // console.log(arr.splice(2));
// // arr.splice(-1); //delete ele fro array
// // console.log(arr);
// // arr.splice(1, 2);
// // console.log(arr);

// //Reverse:mutate the orgainal array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
// //Concat:
// const letter = arr.concat(arr2);
// console.log(letter);
// console.log([...arr, ...arr2]);
// //Join
// console.log(letter.join(' - '));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));
// //get the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('Jonas'.at(-1));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //for loop
// // for (const m of movements) {
// for (const [i, m] of movements.entries()) {
//   if (m > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${m}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrawed ${Math.abs(m)}`);
//   }
// }
// console.log('---------FOREACH--------------');
// //foreach loop

// movements.forEach(function (m, i, arr) {
//   if (m > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${m}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrawed ${Math.abs(m)}`);
//   }
// });
//0: function(200),1:function(450)

//Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //Set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

//Challenge 1:

// function checkDogs(dogsJulia, dogsKate) {
//   const juliaNew = dogsJulia.slice(1, -2);
//   const allDogs = [...juliaNew, ...dogsKate];
//   console.log(allDogs);
//   allDogs.forEach(function (age, i) {
//     age >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`)
//       : console.log(`Dog number ${i + 1} is  still a puppy `);
//   });
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// console.log(movements);
//Arrow function
// const movementsUSD = movements.map(mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementsUSD);
//using For loop
// const movementsUSDFor = [];
// for (const mov of movements) {
//   movementsUSDFor.push(mov * euroToUsd);
// }
// console.log(movementsUSDFor);

// for (const [i, m] of movements.entries()) {
//

// const movementDes = movements.map(
//   (m, i) =>
//     `Movement ${i + 1}: You ${m > 0 ? 'deposited' : 'withdrawed'} ${Math.abs(
//       m
//     )}`
// );

// console.log(movementDes);

//Filter
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposit);
// //For loop
// const depositFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositFor.push(mov);
//   }
// }
// console.log(depositFor);

// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);

//Reduce
//accumulator is like sum
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// //For loop method:
// let balanceFor = 0;
// for (const mov of movements) {
//   balanceFor += mov;
// }
// console.log(balanceFor);

//Get the max value of the array

// const maxValue = movements.reduce((a, c) => {
//   if (a > c) {
//     return a;
//   } else {
//     return c;
//   }
// }, movements[0]);

// const maxValue = movements.reduce((a, c) => (a > c ? a : c), movements[0]);
// console.log(maxValue);

//Challenge 2:
// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => (age > 2 ? 16 + age * 4 : 2 * age));
//   console.log(humanAge);
//   const adultDogs = humanAge.filter(age => age >= 18);
//   console.log(adultDogs);
//   const aveAge = adultDogs.reduce((a, c) => a + c, 0) / adultDogs.length;
//   return aveAge;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//PIPELINE
// const totalDepositInUSD = movements
//   .filter(m => m > 0)
//   .map(m => m * euroToUsd)
//   .reduce((a, c) => a + c, 0);
// console.log(totalDepositInUSD);

//Challenge 3:
// const calcAverageHumanAge = function (ages) {
//   const aveAge = ages
//     .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
//     .filter(age => age >= 18)
//     .reduce((a, c, i, arr) => a + c / arr.length, 0);
//   return aveAge;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//Find Method

// const firstWithdrawl = movements.find(mov => mov < 0);

// console.log(firstWithdrawl);
// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// //FindLast
// console.log(movements);
// const lastWithdrawl = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawl);

// // ('Your lastest largest movement was X movement ago');
// const lastestLargeMivIndex = movements.findLastIndex(
//   mov => Math.abs(mov) > 1000
// );
// console.log(lastestLargeMivIndex);
// console.log(
//   `Your lastest largest movement was ${
//     movements.length - lastestLargeMivIndex
//   } movement ago`
// );

//Some and Every
//Some-----------------------------------------
//Equality
// console.log(movements.includes(-130));
// //Condition
// console.log(movements.some(mov => mov === -130));
// const anyDeposit = movements.some(mov => mov > 1500);
// console.log(anyDeposit);

// //Every
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //Seperate callback

// const deposit = mov => mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// //Flat:
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((a, c) => a + c, 0);

// console.log(overallBalance);

// //FlatMap:only go one level deep
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((a, c) => a + c, 0);

// console.log(overallBalance);

// Coding Challenge #4

// This time, Julia and Kate are studying the activity levels of different dog breeds.

// YOUR TASKS:
// 1. Store the the average weight of a "Husky" in a variable "huskyWeight"
// 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
// 3. Create an array "allActivities" of all the activities of all the dog breeds
// 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
// 5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
// 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
// 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

// BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

// TEST DATA:

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];
// //1.
// const huskyWeight = breeds.find(dog => dog.breed === 'Husky').averageWeight;
// console.log(huskyWeight);
// //2.
// const dogBothActivities = breeds.find(
//   dog => dog.activities.includes('running') && dog.activities.includes('fetch')
// ).breed;
// console.log(dogBothActivities);
// //3.
// const allActivities = breeds.flatMap(dog => dog.activities);
// console.log(allActivities);
// //4.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);
// //5.
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(dog => dog.activities.includes('swimming'))
//       .flatMap(dog => dog.activities)
//       .filter(act => act !== 'swimming')
//   ),
// ];

// console.log(swimmingAdjacent);
// //6.
// console.log(breeds.every(dog => dog.averageWeight >= 10));
// //7.
// console.log(breeds.some(dog => dog.activities.length >= 3));
// //8.
// const likeFetch = breeds
//   .filter(dog => dog.activities.includes('fetch'))
//   .map(dog => dog.averageWeight);
// console.log(likeFetch);
// console.log(Math.max(...likeFetch));

// Chanllenge 5
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //1
// dogs.forEach(function (dog) {
//   dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);
// //2
// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
// sarahDog.curFood > sarahDog.recommendedFood
//   ? console.log(`Sarah's dog is eating too much`)
//   : console.log(`Sarah's dog is eating too little`);
// //3,4
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much! `);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// //5
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// //6
// const okayDogFood = dog =>
//   dog.curFood >= dog.curFood * 0.9 && dog.curFood <= dog.curFood * 1.1;
// const okayDog = dogs.every(okayDogFood);
// console.log(okayDog);
// //7.Create an array containing the dogs that are eating
// // an okay amount of food (try to reuse the condition used in 6
// const okayDog2 = dogs.filter(okayDogFood);
// console.log(okayDog2);

//Sort
//Strings
const owner = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owner.sort());
console.log(owner);

//Number
console.log(movements);
//return < 0, A,B (keep order)
//return > 0, B,A  (switch order)
//Ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

movements.sort((a, b) => a - b);
console.log(movements);
//Descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
