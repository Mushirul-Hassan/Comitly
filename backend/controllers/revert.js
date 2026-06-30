const fs = require("fs");
const path = require("path");
const { copyRecursive } = require("../utils/fileHelpers");

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".Commitly");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const parentDir = path.resolve(repoPath, "..");

    await copyRecursive( commitDir, parentDir);

    console.log(`Commit ${commitID} reverted successfully!`);
  } catch (err) {
    console.error("Unable to revert : ", err);
  }
}

module.exports = { revertRepo };