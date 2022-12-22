"use strict"

const path = require("path");
const passport = require("passport");
const Profile = require("../models/Profile.js");
// const RequestService = require("../services/RequestService");
const checkAuths = require("../services/checkAuths.js");

// const ProfileActions = require("../data/profilesActions.js");
// instantiate the class so we can use its methods
// const _profileActions = new ProfileActions();

exports.GetRegisterPage = async function (req, res) {
  if (req.isLogged)
    return res.redirect("/");

  return res.render("admission/register", {title: "REGISTER TITLE", profile: {}});
};




exports.ProceedRegister = async function (req, res) {
console.log("REGISTER------------------------------------");
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
  console.log("receicing:::::: ", profile, imagePath)
    const tempProfile = new Profile({
      username,
      email,
      firstName,
      lastName,
      imagePath: (imagePath && imagePath.name) || undefined,
      interests
    });
    
    // if (1) {
    //   return res.render("admission/register",
    //     {
    //       title: "",
    //       profile,
    //       errorMessage: "ALL GOOD"
    //     }
    //   );
    // }
    
    if (password !== confirmPassword) // it is been done in fronte and now back end, as well
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
          if (err) {
              // const reqInfo = RequestService.reqHelper(req);
              // const auth = checkAuths(req);
          
              return res.render("admission/register", {
                  title: "Register - error",
                  profile,
                  errorMessage: err.message || err,
                  // reqInfo: reqInfo,
              });
          }

          // User registered so authenticate and redirect to secure area
          passport.authenticate("local")(req, res, () => res.redirect("/"));
      }
    );

  } catch (err) {
    console.error("###ERROR on ProceedRegister", err.message || err);
    return res.render("admission/register", {
      title: "Register - error",
      profile,
      errorMessage: err,
      // reqInfo: reqInfo,
  });
  }


// console.log("------responseObj::: ", responseObj);
//     if (responseObj.errorMsg === "") {
//       // let profiles = await _profileActions.getAllProfiles(); ////////////////
//       profiles = profiles.filter(e => e._id.toString() !== responseObj.obj._id.toString());
  
//       return res.render("profile-details", {
//         title: "Express Yourself - " + responseObj.obj.name,
//         profile: responseObj.obj,
//         profiles,
//         layoutPath: "./layouts/sideBar.ejs",
//         message: "Profile created successfully! \\o/"
//       });
//     }
//     // There are errors. Show form the again with an error message.
//     else {
//       // console.log("XXXAn error occured. Item not created.");
//       return res.render("admission/register", {
//         title: "Create Profile",
//         profile: responseObj.profile,
//         imagePath: responseObj.imagePath,
//         errorMessage: responseObj.errorMsg
//       });
//     }
//   } catch(err) {
//     console.error("###Error on CreateProfile: ", err.message || err);
//     sendError(req, res, (err.message || err));
//   }
}