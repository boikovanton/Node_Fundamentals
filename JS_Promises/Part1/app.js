console.log("JS file loaded");

const factsContainer = document.querySelector("#facts");
const favNum = 7;

// Helper: build a URL that goes through AllOrigins -> NumbersAPI
function numbersApiPath(path) {
  const target = `http://numbersapi.com/${path}`;
  // AllOrigins raw endpoint returns the raw body with proper CORS headers
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
}

// ------------- PART 1: single fact -------------
fetch(numbersApiPath(`${favNum}?json`))
  .then(res => res.json())
  .then(data => {
    console.log("Part 1 data:", data);
    const p = document.createElement("p");
    p.textContent = `Part 1: ${data.text}`;
    factsContainer.appendChild(p);
  })
  .catch(err => console.error("Part 1 error:", err));

// ------------- PART 2: multiple numbers -------------
const nums = [3, 6, 9, 12];

fetch(numbersApiPath(`${nums.join(",")}?json`))
  .then(res => res.json())
  .then(data => {
    console.log("Part 2 data:", data);
    for (let num in data) {
      const p = document.createElement("p");
      p.textContent = `Part 2 (${num}): ${data[num].text}`;
      factsContainer.appendChild(p);
    }
  })
  .catch(err => console.error("Part 2 error:", err));

// ------------- PART 3: 4 facts about same number -------------
const requests = [];
for (let i = 0; i < 4; i++) {
  requests.push(
    fetch(numbersApiPath(`${favNum}?json`)).then(r => r.json())
  );
}

Promise.all(requests)
  .then(facts => {
    console.log("Part 3 data:", facts);
    facts.forEach((f, idx) => {
      const p = document.createElement("p");
      p.textContent = `Part 3 #${idx + 1}: ${f.text}`;
      factsContainer.appendChild(p);
    });
  })
  .catch(err => console.error("Part 3 error:", err));
