"use strict"

// const Profile = require("../models/Profile.js");

// const ProfileActions = require("../data/profilesActions.js");
// instantiate the class so we can use its methods
// const _profileActions = new ProfileActions();
const passport = require("passport");


exports.GetLoginPage = async function (req, res) {
  if (req.isLogged)
    return res.redirect("/");
  
  const { username, errorMessage } = req.query || {};
  
  return res.render("admission/login", { title: "Login", username, errorMessage });
};


exports.ProceedLogin = async (req, res, next) => {
  // console.log("req.body= ", req.body);
  // console.log("req-CONTROLLER-USER======== ", req.body);

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: `/login?username=${req.body.username}&errorMessage=Invalid login.`,
  })(req, res, next);
};
