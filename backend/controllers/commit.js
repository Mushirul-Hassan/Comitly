const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");


async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".Commitly");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitsPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath);
    if (files.length === 0) {
      console.log("No files to commit.");
      return;
    }

    await copyRecursive(stagingPath, commitDir);

    const commitData = {
      message,
      date: new Date().toISOString(),
      id: commitID,
    };

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(commitData),
    );

    console.log(`Commit ${commitID} created with message: ${message}`);

    await fs.rm({recursive: true, force: true});

    await fs.mkdir(stagingPath, {recursive: true});
    console.log("Srtaging area wiped clean!");
  } catch (err) {
    console.error("Error committing files : ", err);
  }
}

async function copyRecursive(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

module.exports = { commitRepo };
