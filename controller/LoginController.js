"use strict"

// const Profile = require("../models/Profile.js");

const ProfileActions = require("../data/profilesActions.js");
// instantiate the class so we can use its methods
const _profileActions = new ProfileActions();

exports.GetLoginPage = async function (req, res) {
  console.log("--- inside LOGIN form CONTROLLER!!!");
  console.log("LOGIN GEeeeeeeeeeT");
  
  return res.render("admission/login", {title: "Login", username: ""});
};

exports.ProceedLogin = async (req, res) => {
  console.log("req.body= ", req.body);

  // for login error handling
  if (1) {
    return res.render("admission/login", {title: "Login", username: req.body.username, errorMessage: "Login is good..."});
  }

  const nameToSearch = req.body.searchFor;
  const profiles = await _profileActions.searchFor(nameToSearch);

  return res.render("profile-search", {
      title: "Express Yourself - Search",
      profiles,
      message: `No profile has been found for *${nameToSearch}*`,
      showReturn: true
    });

};
