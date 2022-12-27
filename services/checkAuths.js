"use strict"

// this middleware checks whether the user is authenticated
// if so, it also provides profile and authorization info
module.exports = async (req, res, next) => {

    if (req.isAuthenticated()) {
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
        
        req.profile = profile;
    } else {
        req.isLogged = false;
    }
    
    next();
}
