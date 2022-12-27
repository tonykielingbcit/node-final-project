"use strict"

const path = require("path");
const passport = require("passport");
const Profile = require("../models/Profile.js");


exports.GetRegisterPage = async function (req, res) {
  if (req.isLogged)
    return res.redirect("/");

  return res.render("admission/register", 
    {
      title: "REGISTER TITLE", 
      profile: {}, 
      cannotEdit: "" // field used to allow/disallow edition on interests component
    }
  );
};



exports.ProceedRegister = async function (req, res) {
  // it arranges int(x) HTML fields into an array
  const input = req.body;
  const interests = [];

  for(let item in input)
    if (item.includes("int") && (input[item].trim().length > 0))
    interests.push(input[item].trim());
    
  const profile = {...input, interests };
        
  try {          
    const { username, email, password, confirmPassword, firstName, lastName } = input;
    const { imagePath } = req.files || {};
    const tempProfile = new Profile({
      username,
      email,
      firstName,
      lastName,
      imagePath: (imagePath && imagePath.name) || undefined,
      interests
    });
    
    if (password !== confirmPassword) // it is been done in front and now back end, as well
      return res.render("admission/register",
      {
        title: "Register - error",
        profile,
        errorMessage: "Passwords MUST be the same, please."
      }
    );

    const error = tempProfile.validateSync();
    
    if (error) {
      console.log("###ERROR - Model is not valid!");
      return res.render("admission/register",
        {
          title: "Register - error",
          profile,
          errorMessage: "Error on validating data. Please, try again."
        }
      );
    }

    // Model is valid, so save it
    if (imagePath) {
      const recordImgAt = path.join(__dirname, "..", "public", "images", imagePath.name);
      await imagePath.mv(recordImgAt, (err) => {
        if (err)
          return res.render("admission/register",
            {
              title: "Register - error",
              profile,
              errorMessage: "Error on validating image. Please, try again."
            }
          );
      });
    }
          
    // // save data on DB
    Profile.register(
      new Profile(tempProfile),
      password,
      function (err, account) {
          // Show registration form with errors if fail.
          if (err)
              return res.render("admission/register", {
                  title: "Register - error",
                  profile,
                  errorMessage: err.message || err
              });

          // User registered so authenticate and redirect to secure area
          passport.authenticate("local")(req, res, () => res.redirect("/"));
      }
    );

  } catch (err) {
    console.error("###ERROR on ProceedRegister", err.message || err);
    return res.render("admission/register", {
      title: "Register - error",
      profile,
      errorMessage: err
  });
  }
}