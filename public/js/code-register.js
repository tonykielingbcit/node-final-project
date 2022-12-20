"use strict"

const registerAddButton = document.getElementById("register-add-button");
registerAddButton && registerAddButton.addEventListener("click", e => {
    e.preventDefault();


    const allInterestsElementsCount = document.getElementsByClassName("interests");
    const currentInterestsCount = allInterestsElementsCount.length;
    console.log("allInterestsElements::: ", currentInterestsCount);
    console.log("addddd +", `int${currentInterestsCount}`);
    
    const currentInput = document.getElementById(`int${currentInterestsCount}`);
    
    if (currentInput.value.trim() === "") {
        currentInput.focus();
        return;
    }

    const interestsContainer = document.getElementById("interests-container");
    
    const newDiv = document.createElement("div");
    newDiv.className = "interests margin-botton";
    newDiv.id = "interests";
    
    const input = document.createElement("input");
    input.type = "text";
    input.className = "register-inputs";
    input.name = `int${currentInterestsCount + 1}`;
    input.id = `int${currentInterestsCount + 1}`;
    newDiv.appendChild(input);
    
    const registerAddButton = document.getElementById("register-add-button");
    newDiv.appendChild(registerAddButton);

    interestsContainer.appendChild(newDiv);
    input.focus();
});


// check whether password and confirmPassword match, if not, it does not go to the server and asks user to fix it
// also, it cheks username filling
const registerButton = document.getElementById("registerButton");
registerButton && registerButton.addEventListener("click", e => {
    // e.preventDefault();
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const username = document.getElementById("username");

    console.log("password.value.trim()::: ", password.value.trim());
    // if (password.value.trim() === "") {
    //     console.log("password.value.trim()22222222::: ", password.value.trim());
    //     e.preventDefault();
    //     password.value = "";
    //     password.style.border = "3px solid red";
    //     password.placeholder = "Password is MANDATORY, please";
    //     password.focus();
    // } else 
    if ((password.value.trim() === "") || (confirmPassword.value !== password.value)) {
        // console.log("password: ", password.value, "confirmPassword: ", confirmPassword.value);
        e.preventDefault();
        password.value = "";
        password.style.border = "3px solid red";
        password.placeholder = "Passwords MUST match, please";
        password.focus();
        confirmPassword.value = "";
        confirmPassword.style.border = "3px solid red";
        confirmPassword.placeholder = "Passwords MUST match, please";
    }

    if (username.value.trim() === "") {
        e.preventDefault();
        username.value = "";
        username.style.border = "3px solid red";
        username.placeholder = "Username is MANDATORY, please";
        username.focus();
    } else if (username.value.trim() !== "")
        username.style.border = "none";

});

