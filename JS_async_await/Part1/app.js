// app.js

const baseURL = "http://numbersapi.com";   // use https if needed: "https://numbersapi.com"
const favNumber = 7;                       // your favorite number
const multiNumbers = [3, 7, 11];          // for part 2

const singleFactDiv = document.getElementById("single-fact");
const multiFactsDiv = document.getElementById("multi-facts");
const fourFactsDiv = document.getElementById("four-facts");
const loadBtn = document.getElementById("load-btn");

// 1. Get ONE fact about your favorite number
async function getSingleNumberFact() {
  try {
    const res = await axios.get(`${baseURL}/${favNumber}?json`);
    const factText = res.data.text;

    console.log("Single fact:", factText);

    singleFactDiv.innerHTML = `<p>${factText}</p>`;
  } catch (err) {
    console.error("Error getting single number fact:", err);
    singleFactDiv.innerHTML = `<p style="color:red;">Error loading fact.</p>`;
  }
}

// 2. Get facts for multiple numbers in ONE request
async function getMultipleNumberFacts() {
  try {
    // e.g. http://numbersapi.com/3,7,11?json
    const res = await axios.get(`${baseURL}/${multiNumbers}?json`);
    const data = res.data;

    console.log("Multiple number facts:", data);

    // Clear previous content
    multiFactsDiv.innerHTML = "";

    for (let num in data) {
      const fact = data[num];
      const p = document.createElement("p");
      p.textContent = `${num}: ${fact}`;
      multiFactsDiv.appendChild(p);
    }
  } catch (err) {
    console.error("Error getting multiple number facts:", err);
    multiFactsDiv.innerHTML = `<p style="color:red;">Error loading multiple facts.</p>`;
  }
}

// 3. Get FOUR facts about your favorite number (4 requests)
async function getFourFactsAboutFavoriteNumber() {
  try {
    // Create an array of promises
    const requests = [];
    for (let i = 0; i < 4; i++) {
      requests.push(axios.get(`${baseURL}/${favNumber}?json`));
    }

    // Wait for all of them at once
    const responses = await Promise.all(requests);

    console.log("Four facts responses:", responses);

    // Clear previous content
    fourFactsDiv.innerHTML = "";

    responses.forEach(res => {
      const factText = res.data.text;
      const p = document.createElement("p");
      p.textContent = factText;
      fourFactsDiv.appendChild(p);
    });
  } catch (err) {
    console.error("Error getting four facts:", err);
    fourFactsDiv.innerHTML = `<p style="color:red;">Error loading four facts.</p>`;
  }
}

// Helper: run all three parts
async function loadAllNumberFacts() {
  await getSingleNumberFact();
  await getMultipleNumberFacts();
  await getFourFactsAboutFavoriteNumber();
}

// Load on button click
loadBtn.addEventListener("click", () => {
  loadAllNumberFacts();
});
