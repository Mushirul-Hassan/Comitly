const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const readline = require("readline");

function prompt(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".Commitly");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const configData = await fs.readFile(
      path.join(repoPath, "config.json"),
      "utf-8",
    );
    const { repoId } = JSON.parse(configData);

    const repo = await Repository.findById(repoId);
    if (!repo) {
      console.log("Error: Repository not found in the database.");
      return;
    }

    console.log("Downloading files from the cloud...");

    for (const dbFile of repo.content) {
      const localFilePath = path.resolve(process.cwd(), dbFile.name);

      const fileExists = await fs
        .access(localFilePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        const localText = await fs.readFile(localFilePath, "utf-8");
        if (localText === dbFile.content) {
          console.log(`Current file is same as ${dbFile.name}`);
          continue;
        }
      } else {
        await fs.writeFile(localFilePath, dbFile.content, "utf-8");
        continue;
      }

      const answer = await prompt(
        "Warning: Your local file  is different from the cloud. Do you want to overwrite your local file? (Y/N)",
      );
      if (answer.trim().toUpperCase() === "Y") {
        await fs.writeFile(localFilePath, dbFile.content, "utf-8");

        console.log(`Pulled: ${dbFile.name}`);
      } else {
        console.error("No change required ");
      }
    }

    console.log("Pull complete! Your local folder is now up to date.");
  } catch (err) {
    console.error("Error pulling repository: ", err);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { pullRepo };
