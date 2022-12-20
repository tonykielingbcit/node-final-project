const express = require("express");
const registerRouter = express.Router();

const registerController = require("../controller/RegisterController.js");

registerRouter.get("/", registerController.Create);

registerRouter.post("/", registerController.CreateProfile);


module.exports = registerRouter;

