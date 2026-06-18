const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) {
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

module.exports = { addRepo };
