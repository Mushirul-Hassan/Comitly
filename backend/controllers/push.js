const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const Repository = require("../models/repoModel");
const mongoose = require("mongoose"); 

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".Commitly");
    const commitsPath = path.join(repoPath, "commits");

    try {
        
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        
        const configData = await fs.readFile(path.join(repoPath, "config.json"));
        const config = JSON.parse(configData);
        const repoId = config.repoId;

        const commitDirs = await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                if(file === "commit.json") continue;

                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath, "utf-8");

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent,
                };
                await s3.upload(params).promise();

                const repo = await Repository.findById(repoId);
                if (repo) {
                    const existingFileIndex = repo.content.findIndex(f => f.name === file);
                    
                    if (existingFileIndex > -1) {
                        repo.content[existingFileIndex].content = fileContent;
                    } else {
                        repo.content.push({ name: file, content: fileContent });
                    }
                    
                    repo.commits.push({
                        message: `Pushed from CLI: ${commitDir.substring(0, 7)}`,
                        date: new Date()
                    });

                    await repo.save();
                }
            }
        }

        console.log("All commits pushed to S3 and synced with MongoDB.");
    } catch (err) {
        console.error("Error pushing to S3/DB : ", err);
    } finally {
        
        await mongoose.disconnect();
    }
}

module.exports = { pushRepo };

