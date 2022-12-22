"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides info needed to check the authorization by next app steps
module.exports = async (req, res, msg = "") => {
    console.log("errorrrrring.......... ", msg);
    const addressError = `"${req.protocol}://${req.get('host')}${req.originalUrl}" is not a valid address in our system.`

    return res.status(404)
        .render("error", { 
                title: "Express Yourself - Error",
                errorMessage: msg || "No page has been found.",
                addressError: msg ? "" : addressError
        }
    );
} 