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

const  displayMovements = function(movement,sort=false){
  const movs = sort? movement.slice().sort((a,b)=> a-b):movement;
  containerMovements.innerHTML='';
  movs.forEach(function(mov,i){
    const type= mov > 0 ? 'deposit' : 'withdrawal';
    
    const html1=`
        <div class="movements">
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
            <div class="movements__value">${mov}€</div>
          </div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html1);
  });
};


const eurToUSD=1.1;
//using normal functions
// const movementsUSD=movements.map(function(mov){
//   return mov*eurToUSD;
// });
//using arrow functions
// const movementsUSD = movements.map(mov => mov*eurToUSD);


//computing username
const createUsernames = function(acc){
  acc.forEach(function(acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
}
createUsernames(accounts);

const createbalance = (acct) => {
  acct.forEach((acc) => {
    acc.balance = acc.movements.reduce((acc,mov)=> acc+mov,0);
  });
};
createbalance(accounts);
const crctDisplayBalance=function(accounts){
  accounts.balance=accounts.movements.reduce((acc,mov)=> acc+mov,0);
  labelBalance.textContent = `${accounts.balance}€`;
}


// const balancesumIn=function(accounts){
//   const sumIn=accounts.filter(mov => mov>0).reduce((acc,mov)=>acc+mov,0);
//   labelSumIn.textContent = `${sumIn}€`;
// }
// balancesumIn(account1.movements);

// const balancesumOut = function (accounts) {
//   const sumOut = accounts.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${sumOut}€`;
// }
// balancesumOut(account1.movements);
// console.log(accounts);

const createDisplaySummary = function(acct){
  const sumIn = acct.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${sumIn}€`;

  const sumOut = acct.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;

  const interest=acct.movements.filter(mov=> mov>0).map(deposit => deposit*acct.interestRate/100).filter(mov => mov>=1).reduce((acc,mov)=> acc+mov,0);
  labelSumInterest.textContent = `${interest}€`;

}

const updateUI = function(acct){
  //displaying balance
  crctDisplayBalance(acct);
  //display movements
  displayMovements(acct.movements);
  //display summary
  createDisplaySummary(acct);
};

let curracct;

btnLogin.addEventListener('click',function(e){
  e.preventDefault();

  curracct = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(curracct?.pin===Number(inputLoginPin.value)){
    inputLoginUsername.value=inputLoginPin.value='';
    containerApp.style.opacity=100;
    inputLoginPin.blur();
    //Display UI message
    labelWelcome.textContent=`Welcome back ${curracct.username.split(' ')[0]}`
    updateUI(curracct);
  }
});

//transfering amount

btnTransfer.addEventListener('click',function(e){

  e.preventDefault();
  
  const amount = Number(inputTransferAmount.value);
  const account = accounts.find(acct => acct.username === inputTransferTo.value);
  inputTransferAmount.value=inputTransferTo.value='';
  inputTransferAmount.blur();
  if(amount>0 && account && account.username!==curracct.username && amount<=curracct.balance){
    curracct.movements.push(-1*amount);
    account.movements.push(amount);
  }
  updateUI(curracct);
});

// requesting Loans

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const Loanamount = Number(inputLoanAmount.value);
  const approval = curracct.movements.filter((mov) => mov > Loanamount*0.1 );
  inputLoanAmount.value='';
  inputLoanAmount.blur();
  if(approval.length !== 0){
    curracct.movements.push(Loanamount);
    updateUI(curracct);
  }
});

//account closure

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if(inputCloseUsername.value === curracct.username && Number(inputClosePin.value) === curracct.pin){
    const index = accounts.findIndex((acc)=> acc.username === curracct.username);
    accounts.splice(index,1);
    containerApp.style.opacity=0;
  }
  inputCloseUsername.value= inputClosePin.value='';
  inputClosePin.blur();
});
let sorted= false;

btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(curracct.movements,!sorted);
  sorted =!sorted;
});







