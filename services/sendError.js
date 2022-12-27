"use strict"

// default error component
module.exports = async (req, res, msg = "") => {
    const addressError = `"${req.protocol}://${req.get('host')}${req.originalUrl}" is not a valid address in our system.`

    return res.status(404)
        .render("error", { 
                title: "SSD Yearbook - Error",
                errorMessage: msg || "No page has been found.",
                addressError: msg ? "" : addressError,
                isLogged: req.isLogged,
                profile: req.profile
        }
    );
} 