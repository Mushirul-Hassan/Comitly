const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const Repository = require("../models/repoModel");

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

      await fs.writeFile(localFilePath, dbFile.content, "utf-8");

      console.log(`Pulled: ${dbFile.name}`);
    }

    console.log("Pull complete! Your local folder is now up to date.");
  } catch (err) {
    console.error("Error pulling repository: ", err);
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { pullRepo };
