const express = require("express");
const indexRouter = express.Router();
const sendError = require("../services/sendError.js");


// GET method routes
indexRouter.get("/", (req, res) => res.render("index", {
    title: "Express Yourself - Home",
}));

indexRouter.get("/about", (req, res) => res.render("about", {
    title: "Express Yourself - About",
}));

// this is the default route
// when a page is not found, this will be reached
indexRouter.get("*", (req, res) => sendError(req, res));
// {
//     const addressError = `"${req.protocol}://${req.get('host')}${req.originalUrl}" is not a valid address in our system.`

//     return res.status(404)
//     .render("error", { 
//             title: "Express Yourself - Error",
//             errorMessage: "No page has been found.",
//             addressError
//         });
// });

// indexRouter.get("/contact", (req, res) => res.render("contact", {
//     title: "Express Yourself - Contact",
// }));
    

// // POST method route
// indexRouter.post("/contact", (req, res) => {
//     res.render("contact", {
//         title: "Express Yourself - Contact",
//         message: "We've received your message. Thank you!"
//     });
// });

module.exports = indexRouter;