const express = require("express");
const registerRouter = express.Router();

const registerController = require("../controller/RegisterController.js");

registerRouter.get("/", registerController.Index);

// registerRouter.post("/", profileController.Search);


module.exports = registerRouter;

