"use strict"

const express = require("express");
const commentsRouter = express.Router();
const commentsController = require("../controller/CommentController");

commentsRouter.post("/create", commentsController.CreateComment);

module.exports = commentsRouter;