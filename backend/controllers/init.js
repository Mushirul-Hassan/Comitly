const fs = require("fs").promises;
const path = require("path");

async function initRepo(repoId) {
  const repoPath = path.resolve(process.cwd(), ".Commitly");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),

      JSON.stringify({ bucket: process.env.S3_BUCKET, repoId: repoId }),
    );
    console.log(`Repository initialized for ID: ${repoId}`);
  } catch (err) {
    console.error("Error initialising repository", err);
  }
}

module.exports = { initRepo };
