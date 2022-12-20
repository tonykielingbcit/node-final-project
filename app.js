"use strict"

// connects to the DB
require("./db/connect.js");

/*

how's the Model relates to the db connection

*/



const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const logger = require('morgan');
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const fileUpload = require("express-fileupload");


// Use environment variable if defined, or a fixed value if not.
const PORT = process.env.PORT || 3003;

// morgan is set ON
// app.use(logger("combined"));

app.use(cors());


// get the routes
const indexRouter = require("./routes/indexRouter.js");
const profilesRouter = require("./routes/profilesRouter.js");
const apiProfilesRouter = require("./routes/apiRouter.js");
const commentsRouter = require("./routes/commentsRouter.js");
const registerRouter = require("./routes/registerRouter.js");
const loginRouter = require("./routes/loginRouter.js");

app.use(express.static('public'));

app.set("views", path.join(__dirname, "views"));
// set the view engine to ejs
app.set("view engine", "ejs");

// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/full-width");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// handle image upload
app.use(fileUpload({
    createParentPath: true,
  })
);
  

// call the routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/profiles", profilesRouter);
app.use("/api", apiProfilesRouter);
app.use("/comments", commentsRouter);
app.use(indexRouter);


app.get("*", (req, res) => res.status(404)
                            .send("<h2 style='text-align: center; color: red; margin-top: 2rem;'>No page has been found</h2>"));

// app is listening
app.listen(PORT, () => {
    console.log(` => Server running at http://localhost:${PORT}`);
});
  
