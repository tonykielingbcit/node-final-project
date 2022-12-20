const mongoose = require("mongoose");

const comment = mongoose.Schema({
  profileId: mongoose.Schema.Types.ObjectId,
  message: mongoose.Schema.Types.String,
  datePosted: mongoose.Schema.Types.Date
});

const profileSchema = mongoose.Schema(
  {
    // MongoDB will automatically create an _id property, so no need to specify it UNLESS we want to create our own

    // We want every profile document to have a name which should be a string and required
    name: { 
      type: "String", 
      required: true,
      // indexedDB: true
    },
    imagePath: { type: "String"},
    
    // interests are optional, so lets just specify that they must be of type Array
    interests: Array,

    // comments received by other Profiles
    // - it allows to also have sentComments DB field for the case when it is necessary to query all comments sent by someone
    // ps. not implementing right (sentComments) now because it is not specificied
    receivedComments: [comment]
  },
  // as a second argument, let's specify the collection we want to work with
  { collection: "profiles" }
);

// Pass the Schema into Mongoose to use as our model
const Profile = mongoose.model("Profile", profileSchema);

// Export it so that we can use this model in our App
module.exports = Profile;
