"use strict"

const path = require("path");
const Profile = require("../models/Profile.js");

class ProfileOps {
  // empty constructor
  ProfileOps() {}

  // DB methods
  async getAllProfiles() {
    console.log("getting all profiles");
    // sorting by lastname first, and then firstname and email subsequently
    let profiles = await Profile.find().collation({locale: "en"}).sort({ lastName: 1, firstName: 1, email: 1 });
    return profiles;
  }

  async getProfileById(id, gettingName = false) {
    // gettingName is a flag to get all comment sender names
    // just in case other part of the system triggers this function but do not need names of the comments senders
    console.log(`getting profile by id ${id}`);
    // sorting by lastname first, and then firstname and email subsequently
    let profile = await Profile.findById(id).sort({ lastName: 1, firstName: 1, email: 1 });
    // console.log("----profile---- ", profile);

    if (gettingName) {
      // it gets the current name for each sender comments Profile
      const receivedCommentsWithName = await profile.receivedComments.map(async e => {
        // console.log("---------------- temp: ", e);
        const temp = await this.getProfileById(e.profileId);
        return ({
            senderName: temp.firstName,
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
          { "lastName": param }
        ]
      }
      );
    console.log("search resultsssssssssss: ", result);

    return (result.length > 0
              ? result
              : undefined) ;
  }



  async createProfile(input, img) {
    // it arranges int(x) HTML fields into an array
    const interests = [];
    for(let item in input)
      if (item.includes("int") && (input[item].trim().length > 0))
        interests.push(input[item].trim());

    try {
      // console.log("this.createProfile: ", input);
      // if(1) return ({obj: input, errorMsg: "rrrrrrrrrr"});

      // const { name } = input;
      const { username, email, password, confirmPassword, firstName, lastName } = input;
      const { imagePath } = img || {};
      const profile = {...input, interests };

  // console.log("---coming data::: ", username, email, password, confirmPassword, firstName, lastName);
  //     console.log("interests:: ", interests, imagePath);
      if (!1) {
        // let profiles = await _profileActions.getAllProfiles(); ////////////////

        return (
          {
            profile,
            errorMsg: "ALL GOOD"
          }
        );
      }

      if (password !== confirmPassword) // it is been done in fronte and now back end, as well
        return ({
            profile,
            errorMsg: "Passwords MUST match, please"
          });

      let tempProfileObj = new Profile({
        username,
        email,
        firstName,
        lastName,
        imagePath: (imagePath && imagePath.name) || undefined,
        interests
      });

      const error = tempProfileObj.validateSync();

      if (error) {
        console.log("XXX Model is not valid!");
        return {
          profile,
          errorMsg: error
        };
      }

      // Model is valid, so save it
      if (imagePath) {
        const recordImgAt = path.join(__dirname, "..", "public", "images", imagePath.name);
        await imagePath.mv(recordImgAt, (err) => {
          if (err)
            return({
              profile,
              errorMsg: err
            });
        });
      }
      
      // // save data on DB
      // const result = await tempProfileObj.save();
      // const response = {
      //   profile: result,
      //   errorMsg: "",
      // };
      const response = Profile.register(
        new Profile(tempProfileObj),
        password,
        (err, user, info) => {
          if (err)
            return false;
          else {
console.log("================= ", user, info);
            return user
          }
        }
      );
        // function async (err, success) {
        //     // Show registration form with errors if fail.
        //     if (err)
        //       return({
        //         profile,
        //         errorMsg: err.message || err || "We are facing technical issues. Sorry."
        //       })
// console.log("SUCESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
            // // User registered so authenticate and redirect to secure area
            // // passport.authenticate("local")(req, res, () => res.redirect("/secure/secure-area"));
            // return passport.authenticate("local", { 
            //     successRedirect : "/secure/secure-area", 
            //     failureFlash : true
            //   }),
            //   function() {
            //     return ({
            //         profile: {...input, interests},
            //         errorMsg: "ALL GOOD"
            //       });
            //   }
        
console.log("8888888888888888888888888888888888888888888888888888888888888888888888888888888888", response);
      return response;

    } catch (err) {
      console.error("###ERROR on ProfileActions.Create", err.message || err);
      return ({
        errorMsg: err.message || err || "###ERROR on ProfileActions.Create",
        profile: {input, ...interests}
      });
    }
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
    const profile = { 
      firstName: bodyContent.firstName,
      lastName: bodyContent.lastName,
      username: bodyContent.username,
      email: bodyContent.email,
      imagePath: imagePath || tempImagePath,
      interests, 
      roles
    };
    // console.log("NEW PROFILE::::::::::::::: ", profile);

    try {
      const receivedImage = files && files.imagePath;
// console.log("NEW PROFILE IMAGETPATH::::::::::::::: ", (receivedImage && receivedImage.name) || profile.imagePath);

      const tempProfileToUpdate = await Profile.findById(profileId);
    // console.log("CURRENT PROFILE::::::::::::::: ", tempProfileToUpdate);
      
      const profileObj = new Profile({
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
// console.log("NEW PROFILEobjjjjjjjjjj::::::::::::::: ", profileObj);

// if (1) {
//   return ({
//     profile,
//     errorMessage: "looks good"
//   });
// }

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

      // console.log("222222 PROFILEtoUPDATE AFTERRRRRRRRR:::::::::: ", profileObj);

      const result = await Profile.updateOne(
        { _id: profileId },
        { 
          $set: {
            ...profileObj
          }
        }
      )
      // console.log("33333333333333 PROFILEtoUPDATE AFTERRRRRRRRR:::::::::: ", profileObj);

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
