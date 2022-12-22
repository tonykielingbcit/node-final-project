"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides info needed to check the authorization by next app steps
module.exports = async (req, res, next) => {
    console.log("checking.......... ", req.isAuthenticated(), req.user, req.body);

    if (req.isAuthenticated()) {
console.log("permition YESSSSSSS");
        req.isLogged = true;
        req.roles = req.body.roles
        next();
    } else {
        console.log("no permissionnnnnnnnnnn");
        return res.render("noPermission");
    }
} 