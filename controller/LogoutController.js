"use strict"

exports.ProceedLogout = async (req, res, next) => {
    // Uses Passports logout function
    req.logout((err) => {
      if (err)
        console.error("###ERROR on logout error: ", err.message || err);

      // Before logging in, users should only be able to see the home page, registration page, and login page.
      return res.redirect("/about");
    });
};
