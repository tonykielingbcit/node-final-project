"use strict"

const path = require("path");
const Profile = require("../models/Profile.js");

const express = require("express");
const commentsRouter = express.Router();


// GET method routes
commentsRouter.post("/create", async (req, res) => {
    try {
        const { profileId, message, datePosted } = req.body;

        const profile = await Profile.findById(profileId);
        console.log("profile === ", profile);

        const newComments = [
            ...profile.receivedComments, 
            {
                profileId,
                message,
                datePosted
            }
        ];
        console.log("newComments==== ", newComments);

        const addCommentProfile = new Profile({
            ...profile._doc,
            receivedComments: newComments
        });
        
        console.log("addCommentProfile:: ", addCommentProfile);

        const error = await addCommentProfile.validateSync();
        if (error)
            throw(error.message);
            // console.log("got errorr:::::: ", error);
            //   throw new Error(error.message || "Error when updating. Please try later."); // Exit if the model is invalid
        else console.log("got NOOOOOOOOOOOOO errorr ");

        

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
});

module.exports = commentsRouter;