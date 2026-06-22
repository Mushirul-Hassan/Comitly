const fs = require("fs").promises;
const path = require("path");
const { isRepoInitialized } = require("../utils/checkRepo");
const { copyRecursive} = require("../utils/fileHelpers");

async function addRepo(filePath) {
  if (!(await isRepoInitialized())) {
    console.log("Not a Commitly repository! Run 'comitly init' first.");
    return;
  }
  const repoPath = path.resolve(process.cwd(), ".Commitly");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });

    const targetPath = path.resolve(process.cwd(), filePath);
    const stats = await fs.stat(targetPath);

    if (stats.isDirectory()) {
      await copyRecursive(targetPath, stagingPath);
      console.log(`All files from ${filePath} added to staging!`);
    } else {
      const fileName = path.basename(targetPath);
      await fs.copyFile(targetPath, path.join(stagingPath, fileName));
      console.log(`File ${fileName} added to the staging area!`);
    }
  } catch (err) {
    console.error("Error adding file : ", err);
  }
}


module.exports = { addRepo };
