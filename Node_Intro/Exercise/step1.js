// step1.js
const fs = require("fs");

// Function to read a file and print its contents
function cat(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);  // stop the script
    }
    console.log(data);
  });
}

// Get command-line argument (file path)
const pathArg = process.argv[2];

if (!pathArg) {
  console.error("Please provide a file path.");
  process.exit(1);
}

cat(pathArg);
