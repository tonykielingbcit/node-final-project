"use strict"

const ProfileActions = require("../data/profilesActions.js");
const sendError = require("../services/sendError.js");

// instantiate the class so we can use its methods
const _profileActions = new ProfileActions();


exports.Index = async function (req, res) {    
  let profiles = await _profileActions.getAllProfiles();
  profiles = profiles.filter(e => e._id.toString() !== req.profile._id.toString());

  return res.render("profiles", {
    title: "SSD Yearbook - Profiles",
    profiles: profiles.length ? profiles : [],
    isLogged: req.isLogged,
    profile: req.profile
  });
};



exports.Search = async (req, res) => {
  const nameToSearch = req.body.searchFor;
  const profiles = await _profileActions.searchFor(nameToSearch);

  return res.render("profile-search", {
      title: "SSD Yearbook - Search",
      profiles,
      message: `No profile has been found for *${nameToSearch}*`,
      showReturn: true,

      isLogged: req.isLogged,
      profile: req.profile
    });
}



exports.Detail = async function (req, res) {
  try {
    const profileId = req.params.id;
    let profile = await _profileActions.getProfileById(profileId, true);
    let profiles = await _profileActions.getAllProfiles();
    profiles = profiles.filter(e => e._id.toString() !== profileId.toString());
    profiles = profiles.filter(e => e._id.toString() !== req.profile._id.toString());

      return res.render("profile-details", {
        title: "SSD Yearbook - " + profile.firstName,
        profiles,
        editor: req.profile,
        profile,
        isLogged: req.isLogged,
        layoutPath: "./layouts/sideBar.ejs"
      });
  } catch (err) {
    console.log("#Error on Detail", err.message || err);
    sendError(req, res, (err.message || err));
  }
};



exports.Delete = async (req, res) => {
  const profileId = req.params.id;
  const profile = await _profileActions.getProfileById(profileId);

  res.render("profile-delete", {
      title: "Delete Profile",
      editor: req.profile,
      profile,
      message: "Are you sure you want to delete this profile?",
      isLogged: req.isLogged
    });
};



exports.DeleteProfile = async (req, res) => {
  const profileId = req.params.id;
  
  let profile = await _profileActions.getProfileById(profileId);

  const deleteProfile = await _profileActions.deleteProfile(profileId);
  
  res.render("profile-delete", {
      title: "Delete Profile - Success",
      profile,
      message: deleteProfile.message,
      editor: req.profile,
      isLogged: req.isLogged
    });
};



exports.EditProfile = async (req, res) => {
    const profileId = req.params.id;
    const profile = await _profileActions.getProfileById(profileId);

    return res.render("profile-edit", {
      title: "Update Profile",
      profile,
      isLogged: req.isLogged,
      editor: req.profile,
    });
};



exports.UpdateProfile = async (req, res) => {
    const profileId = req.params.id;

    const updateProfile = await _profileActions.updateProfile(req.body, profileId, req.files);

    // RECEIVE A MESSAGE from the action and set to the render accordingly
    return res.render("profile-edit", {
        title: "Update Profile",
        profile: updateProfile.profile._doc || updateProfile.profile,
        isLogged: req.isLogged,
        editor: (req.profile.isAdmin || req.profile.isManager) 
                  ? (updateProfile.profile._doc || updateProfile.profile) 
                  : req.profile,
        message: updateProfile.message,
        errorMessage: updateProfile.errorMessage,
        cssClass: updateProfile.errorMessage ? "error-message" : "success-message"
      });
};
