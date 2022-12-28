"use strict"

const Profile = require("../models/Profile.js");

module.exports = async(profileId, message, datePosted, _id, senderName) => {
    try {
        const profile = await Profile.findById(profileId);

        const newComments = [
            ...profile.receivedComments, 
            {
                profileId: _id,
                message,
                datePosted,
                name: senderName
            }
        ];
        
        const addCommentProfile = new Profile({
            ...profile._doc,
            receivedComments: newComments
        });
        
        const error = addCommentProfile.validateSync();
        if (error)
            throw(error.message);
        

        await Profile.updateOne(
            {_id: addCommentProfile._id},
            { 
              $set: {
                receivedComments: addCommentProfile.receivedComments
              }
            }
        );

        return ({
            success: true,
            message: ""
        });
    } catch(err) {
        console.log("ERROR on inserting new comment", err.message || err);
        return ({
            success: false,
            message: err.message || err
        });
    }
};