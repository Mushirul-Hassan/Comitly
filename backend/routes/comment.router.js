const express = require("express");
const commentController = require("../controllers/commentController");

const commentRouter = express.Router();

commentRouter.post("/comment/post/:issueId", commentController.postComment);
commentRouter.get("/comment/:issueId", commentController.getCommentsByIssue);

module.exports = commentRouter;
