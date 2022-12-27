"use strict"

exports.ProceedLogout = async (req, res, next) => {
    // Uses Passports logout function
    req.logout((err) => {
      if (err)
        console.error("###ERROR on logout error: ", err.message || err);

      return res.redirect("/");
    });
};
