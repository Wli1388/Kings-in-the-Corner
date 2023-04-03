//constant variables
const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;
const TOP_DECK = 0;

function Card(r, s, i)
{
  this.rank = r;//rank (King, Queen)
  this.suit = s; //symbol (Spade, Clubs)
  this.imageFilename = i; //image of the card
}
//Card Deck Class
function CardDeck()
{
}
//Card Deck is now an array
CardDeck.prototype = Array.prototype;
//Shuffles the Deck
CardDeck.prototype.shuffleDeck = function()
{
  var tmpDeck = new CardDeck();
  while (this.length > 0)
  {
    var tmpCard = this.splice(getRandomInteger(0, this.length - 1), 1)[0];

    tmpDeck.push(tmpCard);
  }
  this.push.apply(this,tmpDeck);
}
//Makes a new deck from ACE to King
function generateStandardDeck()
{
  var deck = new CardDeck();
  
  for(var r = ACE; r <= KING; r++)
  {
    for(var s = CLUB; s <= SPADE; s++)
    {
      deck.push(new Card (r,s,r + "-" + s + ".png"));
    }
  }
  return deck;
}
function flipCard()
{
  //Conditions checked to see if flipping cards is applicable  
  if(theDeck.length == 0 || flippedCard.firstChild || phase == "Removal")
    return;

  card = theDeck.shift();//removes first card and ouputs first card into variable "card"

  cardImage = document.createElement("img");
  cardImage.src = "cardimages/" + card.imageFilename;
 
  flippedCard.append(cardImage); //shows the flipped card image onto flippedCard div

  //Logic statement to check for game over during adding phase
  checkGameOver();
}
function checkGameOver(){
  //Check for game over in Adding Phase
  if(phase == "Adding")
  {
    if((card.rank == QUEEN) && document.getElementById("2").firstChild && document.getElementById("3").firstChild && document.getElementById("14").firstChild && document.getElementById("15").firstChild)
      setTimeout(() => {  window.location.replace("gameOver.html"); }, 1000);
    if((card.rank == KING) && document.getElementById("1").firstChild && document.getElementById("4").firstChild && document.getElementById("13").firstChild && document.getElementById("16").firstChild)
      setTimeout(() => {  window.location.replace("gameOver.html"); }, 1000);
    if((card.rank == JACK) && document.getElementById("5").firstChild && document.getElementById("8").firstChild && document.getElementById("9").firstChild &&document.getElementById("12").firstChild)
      setTimeout(() => {  window.location.replace("gameOver.html"); }, 1000);
    return;
  }
  //Check for game over in Removal Phase
  if(phase == "Removal")
  {
    for(var i = 0; i < cardArray.length-1; i++){
      for(var j = i+1; j < cardArray.length; j++){
        //If there are no more removable cards, phase will be changed to adding
        if(cardArray[i].rank == null || cardArray[j].rank == null)
          return;
        if((cardArray[i].rank == 10) || (cardArray[i].rank + cardArray[j].rank == 10))
          return; 
      } 
    }
    setTimeout(() => {  window.location.replace("gameOver.html"); }, 1000);
  }
}//To win, all face cards must correctly be on the specific cells and there must be no cards in the middle cells
function checkGameWin(){
  if(cardArray[1].rank == QUEEN && cardArray[2].rank == QUEEN && cardArray[13].rank == QUEEN && cardArray[14].rank == QUEEN && cardArray[0].rank == KING && cardArray[3].rank == KING && cardArray[12].rank == KING && cardArray[15].rank == KING && cardArray[4].rank == JACK && cardArray[7].rank == JACK && cardArray[8].rank == JACK && cardArray[11].rank == JACK && cardArray[5].rank == null &&cardArray[6].rank == null && cardArray[9].rank == null && cardArray[10].rank == null){
    setTimeout(() => {  window.location.replace("gameWon.html"); }, 1);
  }
}
function getRandomInteger(lower,upper)//generates random int from lower to upper
{
  var multiplier = upper - (lower - 1);
  var rnd = parseInt(Math.random() * multiplier) + lower;

  return rnd;
}
function getCard(element)// adds/remove card to/from the grid
{
  if (phase == "Adding")
  {
    //Functions for Adding Phase: adding cars
    addingCards(element);
    checkChangePhaseToRemoval();
  }
  // removal phase: removing cards, doesn't work when put in a seperate function
  else
  {
    if(!element.firstChild)
      return;
    if(cardArray[element.id-1].rank == 10)
    {
      document.getElementById("" + element.id).removeChild(document.getElementById("" + element.id).firstChild);
      //Turns the select card array empty
      cardArray[element.id-1] = {};     
    }
    else
    {
      removalCardArray.push(cardArray[element.id-1]);
      elementIdArray.push(element.id);
      display();
      if (removalCardArray.length == 2)
      {
        //If same card is selected twice, disregard
        if(removalCardArray[0] == removalCardArray[1]){
          removalCardArray = [];
        }
        else if(removalCardArray[0].rank + removalCardArray[1].rank == 10)
        {
          //The Cards selected will be the first card and second card on the grid
          firstCard = document.getElementById("" + elementIdArray[0]);
          firstCard.removeChild(firstCard.firstChild);
          secondCard = document.getElementById("" + elementIdArray[1]);
          secondCard.removeChild(secondCard.firstChild);
          //Turns the selected card array indexes empty
          cardArray[elementIdArray[0]-1] = {};
          cardArray[elementIdArray[1]-1] = {};
        }
        removalCardArray = [];
        elementIdArray = [];
      }
      
    }
    //continues to check the logic whether the game is winning, losing, or needs a phase change
    checkGameWin();
    checkGameOver();
    checkChangePhaseToAdding();
  }
  
}
//Checks whether or not there are still removable cards
function checkChangePhaseToAdding(){
  for(var i = 0; i < cardArray.length; i++){
    for(var j = i+1; j < cardArray.length; j++){
      //If there are no more removable cards, phase will be changed to adding
      if((cardArray[i] != null && cardArray[i].rank == 10) || (cardArray[i] !=null && cardArray[j]!=null && cardArray[i].rank + cardArray[j].rank == 10)){
        phase = "Removal";
        display();    
        return; 
      } 
    }
  }
  phase = "Adding";
  display();
  return;
}
function addingCards(element){
  //Prevents adding card to grid with a card already on it
  if(element.firstChild)
    return;  
  //Logic statements to check where a picture card can be placed
  if(element.id == "1" || element.id == "4" || element.id == "13" || element.id == "16") 
  {//King Cells
    if(card.rank == QUEEN || card.rank == JACK)
      return;
    else{
    flippedCard.removeChild(flippedCard.firstChild);
    element.append(cardImage);
    cardArray[element.id-1] = card;
    }
  }
  if(element.id == "2" || element.id == "3" || element.id == "14" || element.id == "15")
  {//Queen cells
    if(card.rank == KING || card.rank == JACK)
      return;
    else{
    flippedCard.removeChild(flippedCard.firstChild);
    element.append(cardImage);
    cardArray[element.id-1] = card;
    }
  }
  if(element.id == "5" || element.id == "8" || element.id == "9" || element.id == "12")
  {//Jack Cells
    if(card.rank == KING || card.rank == QUEEN)
      return;
    else{
    flippedCard.removeChild(flippedCard.firstChild);
    element.append(cardImage);
    cardArray[element.id-1] = card;
    }
  }//Middle cells
  if(element.id == "6" || element.id == "7" || element.id == "10" || element.id == "11")
  {
    if(card.rank == KING || card.rank == QUEEN || card.rank == JACK)
      return;
    else{
    flippedCard.removeChild(flippedCard.firstChild);
    element.append(cardImage);
    cardArray[element.id-1] = card;
    }
  }
}
function checkChangePhaseToRemoval(){
  //if all cells are taken in the grid then removal
  if(document.getElementById("1").firstChild && document.getElementById("2").firstChild &&document.getElementById("3").firstChild && document.getElementById("4").firstChild &&document.getElementById("5").firstChild && document.getElementById("6").firstChild && document.getElementById("7").firstChild && document.getElementById("8").firstChild && document.getElementById("9").firstChild && document.getElementById("10").firstChild && document.getElementById("11").firstChild && document.getElementById("12").firstChild &&
  document.getElementById("13").firstChild && document.getElementById("14").firstChild && document.getElementById("15").firstChild && document.getElementById("16").firstChild){
    phase = "Removal";
    display(); 
  }
}
function initialize()//initializes all variables and the deck, also used as the reset
{
  phase = "Adding";
  flippedCard = document.getElementById("flipped");
  //theDeck is the main deck and is the deck generated from generateStandardDeck
  theDeck = generateStandardDeck();
  theDeck.shuffleDeck();
  phaseDoc = document.getElementById("phase");
  selectedCards = document.getElementById("selectedCard");
  cardArray = [];
  for(var i = 0; i<=15; i++)
  {
    //creates array with 16 empty cells
    cardArray[i] = {};
  }
  removalCardArray = [];
  elementIdArray = [];
  display();
}
function display()//changes phase html
{
  phaseDoc.innerHTML = "Phase: " + phase;  
}