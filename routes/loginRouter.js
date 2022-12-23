const express = require("express");
const loginRouter = express.Router();

const loginController = require("../controller/LoginController.js");


loginRouter.get("/", loginController.GetLoginPage);

loginRouter.post("/", loginController.ProceedLogin);



module.exports = loginRouter;

