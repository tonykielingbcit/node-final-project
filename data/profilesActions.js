"use strict"

const path = require("path");
const Profile = require("../models/Profile.js");

class ProfileOps {
  // empty constructor
  ProfileOps() {}

  // DB methods
  async getAllProfiles() {
    // sorting by lastname first, and then firstname and email subsequently
    let profiles = await Profile.find().collation({locale: "en"}).sort({ lastName: 1, firstName: 1, email: 1 });
    return profiles;
  }



  async getProfileById(id, gettingName = false) {
    // gettingName is a flag to get all comment sender names
    // just in case other part of the system triggers this function but do not need names of the comments senders
    // sorting by lastname first, and then firstname and email subsequently
    let profile = await Profile.findById(id).sort({ lastName: 1, firstName: 1, email: 1 });

    if (gettingName) {
      // it gets the current name for each sender comments Profile
      const receivedCommentsWithName = await profile.receivedComments.map(async e => {
        const temp = await this.getProfileById(e.profileId);
        const senderName = temp ? temp.firstName : undefined;

        return ({
            senderName,
            removed: !senderName && e.name,  
                // it gets fresh name or name at the moment of recording, if profile has been removed
            profileId: e.profileId,
            message: e.message,
            datePosted: e.datePosted
          });
      });
      const result = await Promise.all(receivedCommentsWithName);

      return ({...profile._doc, receivedComments: [...result]});
    }

    return profile;
  }



  async searchFor(str) {
    const param = new RegExp(".*" + str + ".*");

    const result = await Profile.find({
        $or: [
          { "username": param },
          { "email": param },
          { "firstName": param },
          { "lastName": param },
          { "interests": param }
        ]
      }
      );
  
    return (result.length > 0
              ? result
              : undefined) ;
  }



  async deleteProfile(id) {
    try {
        const deleteAction = await Profile.deleteOne( { "_id" : id });
        if (deleteAction.deletedCount > 0)
            return ({
                success: true,
                message: "Profile has been deleted successfully!"
            });
        else throw new Error();

    } catch(err) {
        console.log(`### Error on deleting ${id}`);
        return({
            success: false,
            message: `Error (${err.message || err || " on deleting profile. Please try again."})`
        });
    }
  }



  async updateProfile(bodyContent, profileId, files) {
    const interests = [];
    for(let item in bodyContent)
      if (item.includes("int") && (bodyContent[item].trim().length > 0))
        interests.push(bodyContent[item].trim());

    const roles = {
      isAdmin: bodyContent.isAdmin ? true : false,
      isManager: bodyContent.isManager ? true : false
    }

    const { tempImagePath } = bodyContent || undefined; 
    const { imagePath } = bodyContent || undefined;
    const { newPassword, confirmPassword } = bodyContent;
    const profile = { 
      _id: profileId,
      firstName: bodyContent.firstName,
      lastName: bodyContent.lastName,
      username: bodyContent.username,
      email: bodyContent.email,
      imagePath: imagePath || tempImagePath,
      interests, 
      roles
    };

    try {
      const receivedImage = files && files.imagePath;
      const tempProfileToUpdate = await Profile.findById(profileId);
      
      let profileObj = new Profile({
          _id: profileId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          username: profile.username,
          interests,
          roles,
          imagePath: (receivedImage && receivedImage.name) || profile.imagePath,
          receivedComments: tempProfileToUpdate.receivedComments
        });

      // it checks whether user wants to update passowrd and handles that
      if (newPassword) {
        if (newPassword !== confirmPassword) // it check on backend
          return ({
            profile,
            errorMessage: "Passwords have to match"
          });
        else
          await profileObj.setPassword(newPassword);
      }

      const error = profileObj.validateSync();
      if (error)
        throw new Error(error.message || "Error when updating. Please try later."); // Exit if the model is invalid
        
      // Model is valid, so save it
      if (receivedImage && receivedImage.name) {
        const recordImgAt = path.join(__dirname, "..", "public", "images", receivedImage.name);
        await receivedImage.mv(recordImgAt, (err) => {
          if (err) throw new Error(error.message || "Error when updating image. Please try later."); // Exit if the model is invalid
        });
      }

      const result = await Profile.updateOne(
        { _id: profileId },
        { 
          $set: {
            ...profileObj
          }
        }
      )

      if (profileObj.hash)
        profileObj.hash = undefined;

      if (profile.salt)
        profileObj.salt = undefined;
        
      return ({
        profile: { ...profileObj },
        success: true,
        message: result.modifiedCount > 0 ? "Update has been done successfully! \\o/" : "No changes detected."
      });
      
    } catch (err) {
      console.error("###ERROR on update!!!!!!!!!!!", err.message || err);
      return ({
        profile,
        success: false,
        errorMessage: err.message || err || "Error on updating profile. Please try again.",
      });
    }
  }
}

module.exports = ProfileOps;
