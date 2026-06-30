const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoriesForCurrentUser,
);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.post("/repo/file/create/:id", repoController.createFile);
repoRouter.get("/repo/file/:id/:fileName", repoController.fetchFileContent);
repoRouter.get("/repo/search", repoController.searchRepositories);
repoRouter.put("/repo/file/update/:id", repoController.updateFile);
repoRouter.delete("/repo/file/delete/:id", repoController.deleteFile);
repoRouter.post("/repo/fork/:id", repoController.forkRepository);

module.exports = repoRouter;
