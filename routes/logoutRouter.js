const express = require("express");
const logoutRouter = express.Router();

const logoutController = require("../controller/LogoutController.js");


logoutRouter.get("/", logoutController.ProceedLogout);


module.exports = logoutRouter;

