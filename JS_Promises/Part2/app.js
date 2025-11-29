console.log("JS file loaded");

const baseURL = "https://deckofcardsapi.com/api/deck";

// =====================
// PART 1
// =====================
axios
  .get(`${baseURL}/new/draw/?count=1`)
  .then(res => {
    const card = res.data.cards[0];
    console.log(`Part 1: ${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
  })
  .catch(err => console.error("Part 1 error:", err));

// =====================
// PART 2
// =====================
let firstCard;
let deckId;

axios
  .get(`${baseURL}/new/draw/?count=1`)
  .then(res => {
    firstCard = res.data.cards[0];
    deckId = res.data.deck_id;
    console.log(
      `Part 2 – first card: ${firstCard.value.toLowerCase()} of ${firstCard.suit.toLowerCase()}`
    );
    return axios.get(`${baseURL}/${deckId}/draw/?count=1`);
  })
  .then(res => {
    const secondCard = res.data.cards[0];
    console.log(
      `Part 2 – second card: ${secondCard.value.toLowerCase()} of ${secondCard.suit.toLowerCase()}`
    );
  })
  .catch(err => console.error("Part 2 error:", err));

// =====================
// PART 3 – interactive deck
// =====================
const drawBtn = document.querySelector("#draw");
const resetBtn = document.querySelector("#reset");
const cardArea = document.querySelector("#card-area");

let deckIdPart3 = null;

// helper: create/shuffle a new deck, clear board, enable draw
function createNewDeck() {
  drawBtn.disabled = true;
  drawBtn.textContent = "Loading deck...";
  cardArea.innerHTML = ""; // remove old cards

  axios
    .get(`${baseURL}/new/shuffle/?deck_count=1`)
    .then(res => {
      deckIdPart3 = res.data.deck_id;
      console.log("Part 3 – new shuffled deck:", deckIdPart3);
      drawBtn.disabled = false;
      drawBtn.textContent = "Draw a Card";
    })
    .catch(err => {
      console.error("Part 3 – deck error:", err);
      drawBtn.disabled = true;
      drawBtn.textContent = "Error loading deck";
    });
}

// on page load, make first deck
createNewDeck();

// draw button click: draw one card from current deck
drawBtn.addEventListener("click", function () {
  if (!deckIdPart3) return;

  axios
    .get(`${baseURL}/${deckIdPart3}/draw/?count=1`)
    .then(res => {
      if (res.data.remaining === 0) {
        drawBtn.disabled = true;
        drawBtn.textContent = "No more cards";
      }

      const card = res.data.cards[0];
      console.log(
        `Drawn card: ${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`
      );

      const img = document.createElement("img");
      img.src = card.image;
      img.alt = `${card.value} of ${card.suit}`;

      const angle = Math.random() * 90 - 45;
      const offsetX = Math.random() * 40 - 20;
      const offsetY = Math.random() * 40 - 20;
      img.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translate(${offsetX}px, ${offsetY}px)`;

      cardArea.appendChild(img);
    })
    .catch(err => console.error("Part 3 – draw error:", err));
});

// reset button click: fresh deck + clear table
resetBtn.addEventListener("click", function () {
  createNewDeck();
});
