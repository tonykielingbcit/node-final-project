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
        console.log("---------------- temp: ", e);
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

    // const profile = await Profile.find({name:{'$regex' : param, '$options' : 'i'}});
    // return (typeof profile.name !== undefined
    //           ? profile
    //           : undefined) ;
    // const usernames = await Profile.find({username:{'$regex' : param, '$options' : 'i'}});
    // const emails = await Profile.find({email:{'$regex' : param, '$options' : 'i'}});
    // const firstNames = await Profile.find({firstName:{'$regex' : param, '$options' : 'i'}});
    // const lastNames = await Profile.find({lastName:{'$regex' : param, '$options' : 'i'}});
    
    // const result = [...usernames, ...emails, ...firstNames, ...lastNames];
    
    
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
    let response = {

    };

    const initial = {
      name: bodyContent.name,
      imagePath: ((files && files.imagePath && files.imagePath.name) || (bodyContent.imagePath || bodyContent.tempImagePath) || ""),
      interests: bodyContent.interests ?? []
    }

    try {
      const addTrimmed = [];
      if (bodyContent.additionals !== "") {
        const additionals = bodyContent.additionals.split(",");
        for (let i of additionals)
          if (i.trim().length > 0)
            addTrimmed.push(i.trim());
      }

      let interests = [];
      for(let item in bodyContent)
          if (item.includes("interest"))
              interests.push(bodyContent[item]);

      interests = [...interests, ...addTrimmed];

      const profileObj = new Profile({
          _id: profileId,
          name: initial.name,
          interests,
          imagePath: initial.imagePath
        });

      const error = await profileObj.validateSync();
      if (error)
        throw new Error(error.message || "Error when updating. Please try later."); // Exit if the model is invalid


      const { imagePath } = files || {};

      // Model is valid, so save it
      if (imagePath && imagePath.name) {
        const recordImgAt = path.join(__dirname, "..", "public", "images", imagePath.name);
        await imagePath.mv(recordImgAt, (err) => {
          if (err) {
            return({
              obj: bodyContent,
              errorMessage: err
            })
          }
        });
      }

      const profileToUpdate = await Profile.findById(profileObj._id);
      profileToUpdate.name = profileObj.name;
      profileToUpdate.interests = profileObj.interests || []
      profileToUpdate.imagePath = ((imagePath && imagePath.name) || initial.imagePath || "");
      
      // const result = await profileToUpdate.save();
      const result = await Profile.updateOne(
        {_id: profileObj._id},
        { 
          $set: {
            name: profileToUpdate.name,
            interests: profileToUpdate.interests,
            imagePath: profileToUpdate.imagePath
          }
        }
      )

      response = {
        profile: profileToUpdate,
        success: true,
        message: result.modifiedCount > 0 ? "Update has been done successfully! \\o/" : "No changes detected."
      };
      
    } catch (err) {
      console.log("error on update!!!!!!!!!!!", err);

        response = {
          obj: initial,
          success: false,
          message: err.message || "Error on deleting profile. Please try again.",
        };
    }

    return response;
  }


}

module.exports = ProfileOps;
