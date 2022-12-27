"use strict"

const passport = require("passport");

exports.GetLoginPage = async function (req, res) {
  if (req.isLogged)
    return res.redirect("/");
  
  const { username, errorMessage } = req.query || {};
  
  return res.render("admission/login", { title: "Login", username, errorMessage });
};


exports.ProceedLogin = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: `/login?username=${req.body.username}&errorMessage=Invalid login.`,
  })(req, res, next);
};
