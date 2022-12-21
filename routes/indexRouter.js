const express = require("express");
const indexRouter = express.Router();


// GET method routes
indexRouter.get("/", (req, res) => res.render("index", {
    title: "Express Yourself - Home",
}));

indexRouter.get("/about", (req, res) => res.render("about", {
    title: "Express Yourself - About",
}));

// indexRouter.get("/contact", (req, res) => res.render("contact", {
//     title: "Express Yourself - Contact",
// }));

indexRouter.get("*", (req, res) => {
    const addressError = `"${req.protocol}://${req.get('host')}${req.originalUrl}" is not a valid address in our system.`
    return res.status(404)
        .render("error", { 
            title: "Express Yourself - Error",
            errorMessage: "No page has been found.",
            addressError
        });
    }
);


// // POST method route
// indexRouter.post("/contact", (req, res) => {
//     res.render("contact", {
//         title: "Express Yourself - Contact",
//         message: "We've received your message. Thank you!"
//     });
// });

module.exports = indexRouter;