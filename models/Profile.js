"use strict"

const mongoose = require("mongoose");
const passportLocalmongoose = require("passport-local-mongoose");

// schema for comments
const comment = mongoose.Schema({
  //about message:
  message: mongoose.Schema.Types.String,
  datePosted: mongoose.Schema.Types.Date,
  
  // about sender:
  profileId: mongoose.Schema.Types.ObjectId,
  name: mongoose.Schema.Types.String
});

const profileSchema = mongoose.Schema(
  {
    // MongoDB will automatically create an _id property, so no need to specify it UNLESS we want to create our own
    
    // name: {type: "String"},////////////////////////////////temp one, has to be removed later on
    username: { 
      type: mongoose.Schema.Types.String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    email: { 
      type: mongoose.Schema.Types.String
    },
    
    firstName: { 
      type: mongoose.Schema.Types.String, 
      required: true
    },
    
    lastName: { 
      type: mongoose.Schema.Types.String,
      required: true
    },
    
    imagePath: { 
      type: mongoose.Schema.Types.String
    },
    
    // interests are optional, so lets just specify that they must be of type Array
    // interests: Array,
    interests: mongoose.Schema.Types.Array,

    // comments received by other Profiles
    // - it allows to also have sentComments DB field for the case when it is necessary to query all comments sent by someone
    // ps. not implementing (sentComments) right now because it is not specificied
    receivedComments: [comment],

    roles: {
      isManager: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      },
      isAdmin: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
      }
    },

    // would have profile modified for isRemoved instead of deleting it
    // isRemoved: {
    //   type: mongoose.Schema.Types.Boolean,
    //   default: false
    // }
  },
  // as a second argument, let's specify the collection we want to work with
  { collection: "profiles" }
);

profileSchema.plugin(passportLocalmongoose);

// Pass the Schema into Mongoose to use as our model
const Profile = mongoose.model("Profile", profileSchema);

// Export it so that we can use this model in our App
module.exports = Profile;
