"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides profile and authorization info
module.exports = async (req, res, next) => {
    // console.log("checking.......... ", req.isAuthenticated());
    // , req.user, req.body);

    if (req.isAuthenticated()) {
console.log("permition YESSSSSSS, req.body:::::: "); //, req.user);
        req.isLogged = true;
        const { _id, username, email, firstName, lastName, imagePath, interests, roles } = req.user;
        const profile = {
            _id,
            username,
            email,
            firstName, 
            lastName,
            imagePath,
            interests,
            roles
        };
        
        // req.roles = roles;
        req.profile = profile;
    } else {
        // console.log("no permissionnnnnnnnnnn");
        req.isLogged = false;
    }
    next();
}
