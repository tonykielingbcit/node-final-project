"use strict"

const handleComment = require("../data/commentsActions");

// it handles new comments
exports.CreateComment = async function (req, res) {
    const { profileId, message, datePosted } = req.body;  // comment RECEIVER
    const { _id, firstName } = req.profile;  // comment SENDER
    
    const newMessage = await handleComment(profileId, message, datePosted, _id, firstName);

    return res.json(newMessage);
}
