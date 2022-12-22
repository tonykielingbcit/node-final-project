"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides profile and authorization info
module.exports = async (req, res, next) => {
    console.log("checking.......... ", req.isAuthenticated());
    // , req.user, req.body);

    if (req.isAuthenticated()) {
console.log("permition YESSSSSSS, req.body:::::: ", req.body);
        req.isLogged = true;
        const { _id, username, email, firstName, lastName, interests, receivedComments } = req.user;
        const profile = {
            _id,
            username,
            email,
            firstName, 
            lastName, 
            // interests, // do not need these two for now
            // receivedComments
        };
        
        req.roles = req.user.roles;
        req.profile = profile;
    } else {
        console.log("no permissionnnnnnnnnnn");
        req.isLogged = false;
        // return res.render("noPermission");
    }
    next();
}
