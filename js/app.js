/*
 * Create a list that holds all of your cards
 * 1. Diamond | 2. Bicycle | 3. Bomb | 4. Cube
 * 5. Paperplane | 6. Bolt | 7. Leaf | 8. Anchor
 */
 const cardList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976, I've explained it to myself with side comments.
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        // return number between 1 and number of cards on cardList
        randomIndex = Math.floor(Math.random() * currentIndex); // get number between 1 to 15
        currentIndex -= 1; // we start with 15 as currentIndex (16-1) which is the last item in the array
        temporaryValue = array[currentIndex]; //what's lying behind card #[currentIndex] is temporaryValue, we save it
        // because it's gonna get overwritten when we re-assign it.
        array[currentIndex] = array[randomIndex]; //put whatever card you got randomly in the current index
        array[randomIndex] = temporaryValue; //put whatever card was in the current index in the random index.
    }

    return array;

}

let shufdCardList;

function placeCards() {
  shufdCardList = shuffle(cardList);
  let cardSpot = 1; //c+cardSpot is the id of the card on the DOM
  let cardOnDOM;
  const addSymbolData = card => {cardOnDOM.setAttribute("data-symbol", card)}
  for (const card of shufdCardList) {
    cardOnDOM = document.getElementById(`c${cardSpot}`);
    let cardClass;
    switch(card) {
      case 1: cardClass = "fa-diamond"; addSymbolData(card); break;
      case 2: cardClass = "fa-bicycle"; addSymbolData(card); break;
      case 3: cardClass = "fa-bomb"; addSymbolData(card); break;
      case 4: cardClass = "fa-cube"; addSymbolData(card); break;
      case 5: cardClass = "fa-paper-plane-o"; addSymbolData(card); break;
      case 6: cardClass = "fa-bolt"; addSymbolData(card); break;
      case 7: cardClass = "fa-leaf"; addSymbolData(card); break;
      case 8: cardClass = "fa-anchor"; addSymbolData(card); break;
    }
    let cardVisual = cardOnDOM.firstElementChild;
    if (cardVisual.classList.item(1) !== null) {
      cardVisual.setAttribute('class', 'fa');
    }
    cardVisual.classList.add(cardClass);
    cardSpot++;
  }
}
placeCards();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let deck = document.querySelector(".deck");
let restartBtn = document.querySelector(".restart");
let backBtn = document.querySelector(".back");
let firstCard = 0;
let secondCard = 0;
let isEqual = 0;
let movesNum = 0;
let moves = document.querySelector('.moves');
moves.textContent = movesNum;
class CardPair {
  constructor (firstCard, secondCard) {
    this.firstCard = firstCard;
    this.secondCard = secondCard;
  }
}
let cardPairs = [];
let pairsMade = 0;
let starNum = 3;
let prevStarNum = starNum; // log the previous starNum so that we don't
                           // touch the stars in the dom if there is no need to
let stars =    `<li><i class="fa fa-star"></i></li>
        		    <li><i class="fa fa-star"></i></li>
        		    <li><i class="fa fa-star"></i></li>`;
let starsOnDOM = document.querySelector('.stars');
starsOnDOM.innerHTML = stars;
let lastPairedFirstCard;
let lastPairedSecondCard;
let firstCardTimeout;
let secondCardTimeout;
function showCard(cardSpot) {
  function increaseMoves() {
    movesNum++;
    moves.textContent = movesNum;
    setStars();
  }
  function createPair(firstCard, secondCard) {
    const cardPair = new CardPair (firstCard, secondCard);
    cardPairs.push(cardPair);
    lastPairedFirstCard = cardPairs[cardPairs.length-1].firstCard;
    lastPairedSecondCard = cardPairs[cardPairs.length-1].secondCard;
  }
  if (firstCard === 0) {
    firstCard = cardSpot;
    if (movesNum > 1) {
    if (firstCard === lastPairedSecondCard ) {
      clearTimeout(secondCardTimeout);
    } else if (firstCard === lastPairedFirstCard) {
      clearTimeout(firstCardTimeout);
    }
    }
    if (!firstCard.classList.contains('show')) { firstCard.classList.add('show'); }
    increaseMoves();
    return false;
  } //keep the card as firstCard if there is no card open yet
  if (firstCard !== 0 && secondCard === 0) { //second card has been chosen
    if (cardSpot === firstCard) { //if it's the exact same card
      return false;
    }
    secondCard = cardSpot;
    increaseMoves();
    createPair(firstCard, secondCard);
    secondCard.classList.add('show');
    checkEquality(firstCard, secondCard);
    firstCard = 0; secondCard = 0;
    if (!isEqual) {
      firstCardTimeout = setTimeout(function() {
          lastPairedFirstCard.classList.remove('show');
      },  1100);
      secondCardTimeout = setTimeout(function() {
          lastPairedSecondCard.classList.remove('show');
      }, 1100)
    } else {
      lastPairedFirstCard.classList.add('match');
      lastPairedSecondCard.classList.add('match');
      pairsMade++;
      if (pairsMade === 8) {
        let winScreen = document.createElement('div');
        winScreen.className = 'winContainer';
        winScreen.innerHTML = `<div class="win">
                               <p> Yay! </p>
                               <h1> You win! </h1>
                               </div>`
        document.querySelector('.deck').appendChild(winScreen);
      }
    }
  }
  function checkEquality(first, second) {
    isEqual = ( first.dataset.symbol === second.dataset.symbol ) ? true : 0;
  }
  function setStars() {
    if (movesNum > 22) {
      starNum = 1;
    }
    else if (movesNum > 16 && movesNum <= 22) {
      starNum = 2;
    }
    if (prevStarNum !== starNum) {
    prevStarNum = starNum;
    switch (starNum) {
      case 2: stars = `<li><i class="fa fa-star"></i></li>
                       <li><i class="fa fa-star"></i></li>`;
                       break;
      case 1: stars = `<li><i class="fa fa-star"></i></li>`;
                       break;
    }
    starsOnDOM.innerHTML = stars;
  }
}
}

function restartCards() {
  cardPairs = [];
  pairsMade = 0;
  movesNum = 0;
  moves.textContent = movesNum;
  starNum = 3;
  firstCard = 0;
  prevStarNum = starNum;
  stars =        `<li><i class="fa fa-star"></i></li>
          		    <li><i class="fa fa-star"></i></li>
          		    <li><i class="fa fa-star"></i></li>`;
  starsOnDOM.innerHTML = stars;
  let cards = document.querySelectorAll('.card');
  for (const card of cards) {
    if (card.classList.contains('show')) { card.classList.remove('show'); }
    if (card.classList.contains('match')) { card.classList.remove('match'); }
  }
  placeCards();
}

function undoCard() {
  firstCard.classList.remove('show');
  firstCard = 0;
}

/* EVENT LISTENERS */
deck.onclick = function(event) {
  let target = event.target;
  let ccSpot = target.closest('li'); //clicked card spot, navigate up the tree to the li parent element
  if (ccSpot) { if ( ccSpot.classList.contains('show') === false ) {
     showCard(ccSpot) }
     else if (!ccSpot.classList.contains('match') && ( ccSpot === lastPairedFirstCard || ccSpot === lastPairedSecondCard ) ) {
       showCard(ccSpot) }
  }
  //send clicked card spot to showCard
}
restartBtn.onclick = function(event) {
  restartCards();
}
backBtn.onclick = function(event) {
  undoCard();
}
