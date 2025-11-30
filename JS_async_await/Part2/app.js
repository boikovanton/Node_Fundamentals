// app.js

const baseURL = "https://deckofcardsapi.com/api/deck";
let currentDeckId = null;

// DOM elements
const btnStep1 = document.getElementById("btn-step1");
const btnStep2 = document.getElementById("btn-step2");
const btnNewDeck = document.getElementById("btn-new-deck");
const btnDrawCard = document.getElementById("btn-draw-card");
const cardsContainer = document.getElementById("cards-container");
const logDiv = document.getElementById("log");

// Small helper to log to the page + console
function addLog(message) {
  console.log(message);
  const p = document.createElement("p");
  p.textContent = message;
  logDiv.appendChild(p);
}

/* --------------------------------------
 * STEP 1:
 * Single card from a newly shuffled deck
 * ------------------------------------*/
async function getSingleCardFromNewDeck() {
  try {
    const res = await axios.get(`${baseURL}/new/draw/?count=1`);
    const card = res.data.cards[0];
    const value = card.value.toLowerCase();
    const suit = card.suit.toLowerCase();

    addLog(`Step 1: Drew a card -> ${value} of ${suit}`);

    // Optional: show it on page as well
    showCard(card);
  } catch (err) {
    console.error("Error in Step 1:", err);
    addLog("Error in Step 1 (check console).");
  }
}

/* --------------------------------------
 * STEP 2:
 * Two cards from the SAME newly shuffled deck
 * ------------------------------------*/
async function getTwoCardsFromSameDeck() {
  try {
    // First request: new deck + 1 card
    const firstRes = await axios.get(`${baseURL}/new/draw/?count=1`);
    const firstCard = firstRes.data.cards[0];
    const deckId = firstRes.data.deck_id;

    const firstVal = firstCard.value.toLowerCase();
    const firstSuit = firstCard.suit.toLowerCase();

    addLog(`Step 2: First card -> ${firstVal} of ${firstSuit}`);

    // Second request: use SAME deck_id to draw another card
    const secondRes = await axios.get(`${baseURL}/${deckId}/draw/?count=1`);
    const secondCard = secondRes.data.cards[0];

    const secondVal = secondCard.value.toLowerCase();
    const secondSuit = secondCard.suit.toLowerCase();

    addLog(`Step 2: Second card -> ${secondVal} of ${secondSuit}`);

    // Optional: show both cards on page
    showCard(firstCard);
    showCard(secondCard);
  } catch (err) {
    console.error("Error in Step 2:", err);
    addLog("Error in Step 2 (check console).");
  }
}

/* --------------------------------------
 * STEP 3:
 * Interactive page:
 *  - When page loads or "New Deck" clicked: create a new deck
 *  - Clicking "Draw Card" draws from that deck and shows on page
 * ------------------------------------*/
async function createNewDeck() {
  try {
    const res = await axios.get(`${baseURL}/new/shuffle/?deck_count=1`);
    currentDeckId = res.data.deck_id;
    cardsContainer.innerHTML = "";
    btnDrawCard.disabled = false;
    addLog(`New deck created with deck_id: ${currentDeckId}`);
  } catch (err) {
    console.error("Error creating new deck:", err);
    addLog("Error creating new deck (check console).");
  }
}

async function drawCardFromCurrentDeck() {
  if (!currentDeckId) {
    addLog("No deck yet. Click 'New Deck' first.");
    return;
  }

  try {
    const res = await axios.get(
      `${baseURL}/${currentDeckId}/draw/?count=1`
    );

    if (res.data.remaining === 0) {
      btnDrawCard.disabled = true;
      addLog("No more cards left in the deck.");
    }

    if (res.data.cards.length === 0) {
      addLog("No card returned (deck might be empty).");
      return;
    }

    const card = res.data.cards[0];
    const value = card.value.toLowerCase();
    const suit = card.suit.toLowerCase();

    addLog(`Drew card: ${value} of ${suit} (remaining: ${res.data.remaining})`);
    showCard(card);
  } catch (err) {
    console.error("Error drawing card:", err);
    addLog("Error drawing card (check console).");
  }
}

// Helper to visually add card image
function showCard(card) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const img = document.createElement("img");
  img.src = card.image;
  img.alt = `${card.value} of ${card.suit}`;

  cardDiv.appendChild(img);
  cardsContainer.appendChild(cardDiv);
}

/* --------------------------------------
 * Event listeners
 * ------------------------------------*/
btnStep1.addEventListener("click", getSingleCardFromNewDeck);
btnStep2.addEventListener("click", getTwoCardsFromSameDeck);

btnNewDeck.addEventListener("click", createNewDeck);
btnDrawCard.addEventListener("click", drawCardFromCurrentDeck);

// Optional: create a deck as soon as page loads
window.addEventListener("DOMContentLoaded", () => {
  createNewDeck();
});
