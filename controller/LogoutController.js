"use strict"

exports.ProceedLogout = async (req, res, next) => {
  console.log("LOGOUT    req-CONTROLLER-USER======== ", req.isLogged);
  
    // Use Passports logout function
    req.logout((err) => {
      if (err)
        console.error("###ERROR on logout error: ", err.message || err);

      return res.redirect("/");
    });
};
