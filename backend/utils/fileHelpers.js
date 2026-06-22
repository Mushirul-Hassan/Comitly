const fs = require("fs").promises;
const path = require("path");

async function copyRecursive(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (
      entry.name === ".Commitly" ||
      entry.name === "node_modules" ||
      entry.name === ".git"
    )
      continue;

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

module.exports = { copyRecursive };
