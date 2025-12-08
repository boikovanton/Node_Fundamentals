// step2.js
const fs = require("fs");
const axios = require("axios");

// Reads a file from the file system
function cat(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    console.log(data);
  });
}

// Reads content from a URL using axios
async function webCat(url) {
  try {
    let resp = await axios.get(url);
    console.log(resp.data);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

// Get the argument (file path or URL)
const arg = process.argv[2];

if (!arg) {
  console.error("Please provide a file path or URL.");
  process.exit(1);
}

// Decide if arg is a URL (starts with http)
if (arg.startsWith("http://") || arg.startsWith("https://")) {
  webCat(arg);
} else {
  cat(arg);
}
