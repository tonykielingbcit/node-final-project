"use strict"

const Profile = require("../models/Profile.js");


// it handles new comments
exports.CreateComment = async function (req, res) {
    // console.log("\nNEWWWWWWWWWWWWWWWWWWWWWWWW CONTROLLERRRRRRRRRRRRRRRRRRRRRRRRRRRRRR\n");
    try {
        const { profileId, message, datePosted } = req.body;  // comment RECEIVER
        const { _id } = req.profile;  // comment SENDER

        const profile = await Profile.findById(profileId);
        // console.log("profile === ", profile);

        const newComments = [
            ...profile.receivedComments, 
            {
                profileId: _id,
                message,
                datePosted,
                name: profile.firstName
            }
        ];
        // console.log("newComments==== ", newComments);

        const addCommentProfile = new Profile({
            ...profile._doc,
            receivedComments: newComments
        });
        
        // console.log("addCommentProfile:: ", addCommentProfile);

        const error = addCommentProfile.validateSync();
        if (error)
            throw(error.message);

        else console.log("got NOOOOOOOOOOOOO errorr "); // debug purposes

        

        await Profile.updateOne(
            {_id: addCommentProfile._id},
            { 
              $set: {
                name: addCommentProfile.name,
                interests: addCommentProfile.interests,
                imagePath: addCommentProfile.imagePath,
                receivedComments: addCommentProfile.receivedComments
              }
            }
        );

        return res.json({
            success: true,
            message: ""
        });
    } catch(err) {
        console.log("ERROR on inserting new comment", err.message || err);
        return res.json({
            success: false,
            message: err.message || err
        });
    }
}
