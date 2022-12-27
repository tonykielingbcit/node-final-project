"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides info needed to check the authorization by next app steps
module.exports = async (req, res, next) => {
    if (!req.isLogged)
        return res.redirect("/login");

    next();
} 