const express = require("express");
const registerRouter = express.Router();

const registerController = require("../controller/RegisterController.js");

registerRouter.get("/", registerController.GetRegisterPage);

registerRouter.post("/", registerController.ProceedRegister);


module.exports = registerRouter;

