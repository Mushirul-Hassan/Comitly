const fs = require("fs").promises;
const path = require("path");

async function isRepoInitialized() {
  const repoPath = path.resolve(process.cwd(), ".Commitly");

  try {
    await fs.access(repoPath);
    return true;
  } catch {
    return false;
  }
}

module.exports = { isRepoInitialized };