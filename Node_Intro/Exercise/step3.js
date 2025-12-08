// step3.js
const fs = require("fs");
const axios = require("axios");

// Helper: either print to console or write to a file
function handleOutput(text, outPath) {
  if (outPath) {
    fs.writeFile(outPath, text, "utf8", function (err) {
      if (err) {
        console.error(`Couldn't write ${outPath}:\n  ${err}`);
        process.exit(1);
      }
      // success: no output (as spec says)
    });
  } else {
    console.log(text);
  }
}

// Read from a file
function cat(path, outPath) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    handleOutput(data, outPath);
  });
}

// Read from a URL
async function webCat(url, outPath) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, outPath);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

// --- CLI argument parsing ---

// We care about things after `node step3.js`
const args = process.argv.slice(2);

let outPath = null;
let source;

// Case 1: with --out
// node step3.js --out new.txt one.txt
if (args[0] === "--out") {
  outPath = args[1];
  source = args[2];
} else {
  // Case 2: normal usage
  // node step3.js one.txt
  // node step3.js http://google.com
  source = args[0];
}

if (!source) {
  console.error("Usage:");
  console.error("  node step3.js <file-or-url>");
  console.error("  node step3.js --out output.txt <file-or-url>");
  process.exit(1);
}

// Decide if it's a URL or a file path
if (source.startsWith("http://") || source.startsWith("https://")) {
  webCat(source, outPath);
} else {
  cat(source, outPath);
}
