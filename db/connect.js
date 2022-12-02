"use strict"

// gets the DB credentials in a external file (.env)
require('dotenv').config();

//MongoDB connection setup
const { mongoose } = require("mongoose");
const uri =
  `mongodb+srv://${process.env.user}:${process.env.passwd}@cluster0.iw7hm03.mongodb.net/${process.env.db}?retryWrites=true&w=majority`;

// set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// print success
db.once("open", () => console.log(`User '${process.env.user}' connected to MongoDB successfully! *** db = '${process.env.db}'`));

module.exports = db;