"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides info needed to check the authorization by next app steps
module.exports = async (req, res, next) => {
    console.log("protecting route................. ", req.isAuthenticated(), req.user, req.body);

    if (!req.isLogged)
        return res.redirect("/");

    next();
} 