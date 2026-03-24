const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "src"); // عدل إذا كودك مش في src
const arabicRegex = /[ء-ي]/;

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDir(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const lines = fs.readFileSync(filePath, "utf8").split("\n");
      lines.forEach((line, index) => {
        if (arabicRegex.test(line)) {
          console.log(`${filePath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

scanDir(targetDir);
