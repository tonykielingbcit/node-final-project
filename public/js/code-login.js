"use strict"

const loginButton = document.getElementById("loginButton");
loginButton && loginButton.addEventListener("click", e => {
    // e.preventDefault();
    console.log("loginButton");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (password.value.trim() === "") {
        e.preventDefault();
        password.style.border = "3px solid red";
        password.placeholder = "Your password, please";
        password.focus();
    } else
        password.style.border = "none";


    if (username.value.trim() === "") {
        e.preventDefault();
        username.style.border = "3px solid red";
        username.placeholder = "Your username, please";
        username.focus();
    } else
        username.style.border = "none";

});