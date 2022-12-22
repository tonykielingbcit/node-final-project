"use strict"

// const Profile = require("../models/Profile.js");

const ProfileActions = require("../data/profilesActions.js");
const sendError = require("../services/sendError.js");
// instantiate the class so we can use its methods
const _profileActions = new ProfileActions();

exports.Index = async function (request, response) {
  // console.log("REQUEST:::::::::::", request.session);
  console.log("loading profiles from controller");
  let profiles = await _profileActions.getAllProfiles();
  return response.render("profiles", {
    title: "Express Yourself - Profiles",
    profiles: profiles.length ? profiles : [],
  });
};

exports.Search = async (req, res) => {
    const nameToSearch = req.body.searchFor;
    const profiles = await _profileActions.searchFor(nameToSearch);

    return res.render("profile-search", {
        title: "Express Yourself - Search",
        profiles,
        message: `No profile has been found for *${nameToSearch}*`,
        showReturn: true
      });
}

// exports.Login = async (req, res) => {
//   return res.render("admission/login");
// }

exports.Detail = async function (req, res) {
  try {
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId, true);
  
    let profiles = await _profileActions.getAllProfiles();
    profiles = profiles.filter(e => e._id.toString() !== profileId);
  
    if (profile) {
      res.render("profile-details", {
        title: "Express Yourself - " + profile.name,
        profiles,
        profile,
        layoutPath: "./layouts/sideBar.ejs"
      });
    } else {
      res.render("profiles", {
        title: "Express Yourself - Profiles",
        profiles: [],
      });
    }
  } catch (err) {
    console.log("#Error on Detail", err.message || err);
    // return response.render("error", { title: "Error" });
    sendError(req, res, (err.message || err));
  }
};

// Handle profile form GET request
exports.Create = async function (req, res) {
    res.render("admission/register", {
      title: "Create Profile",
      errorMessage: "",
      profile: {}
  });
};

// Handle profile form GET request
exports.CreateProfile = async function (req, res) {
  // instantiate a new Profile Object populated with form data
  try {
    let responseObj = await _profileActions.createProfile(req.body, req.files);
console.log("------responseObj::: ", responseObj);
    if (responseObj.errorMsg === "") {
      // let profiles = await _profileActions.getAllProfiles(); ////////////////
      profiles = profiles.filter(e => e._id.toString() !== responseObj.obj._id.toString());
  
      return res.render("profile-details", {
        title: "Express Yourself - " + responseObj.obj.name,
        profile: responseObj.obj,
        profiles,
        layoutPath: "./layouts/sideBar.ejs",
        message: "Profile created successfully! \\o/"
      });
    }
    // There are errors. Show form the again with an error message.
    else {
      // console.log("XXXAn error occured. Item not created.");
      return res.render("admission/register", {
        title: "Create Profile",
        profile: responseObj.profile,
        imagePath: responseObj.imagePath,
        errorMessage: responseObj.errorMsg
      });
    }
  } catch(err) {
    console.error("###Error on CreateProfile: ", err.message || err);
    sendError(req, res, (err.message || err));
  }
};


exports.Delete = async (req, res) => {
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId);
    const validProfile = (typeof profile.name !== undefined) ? true : false;

    res.render("profile-delete", {
        title: "Delete Profile",
        profile,
        message: validProfile ? "Are you sure you want to delete this profile?" : undefined,
        errorMessage: !validProfile ? "No Profile has been found, please try again." : undefined,
        showButtons: validProfile  // if no profile found, it does not show the buttons
      });
};


exports.DeleteProfile = async (req, res) => {
    const profileId = req.params.id;
    
    let profile = await _profileActions.getProfileById(profileId);

    const deleteProfile = await _profileActions.deleteProfile(profileId);
    
    res.render("profile-delete", {
        title: "Delete Profile - Success",
        profile,
        message: deleteProfile.message
      });
};


exports.EditProfile = async (req, res) => {
    const profileId = req.params.id;
    console.log(`loading single profile by id ${profileId}`);
    let profile = await _profileActions.getProfileById(profileId);
    const validProfile = (typeof profile.name !== undefined) ? true : false;

    res.render("profile-edit", {
        title: "Update Profile",
        profile,
        errorMessage: !validProfile ? "No Profile has been found, please try again." : undefined,
      });
};

exports.UpdateProfile = async (req, res) => {
    const profileId = req.params.id;

    const updateProfile = await _profileActions.updateProfile(req.body, profileId, req.files);

    // RECEIVE A MESSAGE from the action and set to the render accordingly
    return res.render("profile-edit", {
        title: "Update Profile",
        profile: updateProfile.profile,
        message: updateProfile.message
      });
};
