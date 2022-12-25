"use strict"

// const registerAddButton = document.getElementById("register-add-button");
// registerAddButton && registerAddButton.addEventListener("click", e => {
//     e.preventDefault();

//     const allInterestsElementsCount = document.getElementsByClassName("interests");
//     const currentInterestsCount = allInterestsElementsCount.length;
//     console.log("allInterestsElements::: ", currentInterestsCount);
//     console.log("addddd+++++++++++", `int${currentInterestsCount}`);
    
//     const currentInput = document.getElementById(`int${currentInterestsCount}`);
    
//     if (currentInput.value.trim() === "") {
//         currentInput.focus();
//         return;
//     }

//     const interestsContainer = document.getElementById("interests-container");
    
//     const newDiv = document.createElement("div");
//     newDiv.className = "interests margin-botton";
//     newDiv.id = "interests";
    
//     const input = document.createElement("input");
//     input.type = "text";
//     input.className = "register-inputs";
//     input.name = `int${currentInterestsCount + 1}`;
//     input.id = `int${currentInterestsCount + 1}`;
//     newDiv.appendChild(input);
    
//     const registerAddButton = document.getElementById("register-add-button");
//     newDiv.appendChild(registerAddButton);

//     interestsContainer.appendChild(newDiv);
//     input.focus();
// });


// check whether password and confirmPassword match, if not, it does not go to the server and asks user to fix it
// also, it cheks username filling
const registerButton = document.getElementById("registerButton");
registerButton && registerButton.addEventListener("click", e => {
    // e.preventDefault();
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const username = document.getElementById("username");
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");

    if (lastName.value.trim() === "") {
        e.preventDefault();
        lastName.value = "";
        lastName.style.border = "3px solid red";
        lastName.placeholder = "Last Name is MANDATORY, please";
        lastName.focus();
    } else
        lastName.style.border = "none";

    if (firstName.value.trim() === "") {
        e.preventDefault();
        firstName.value = "";
        firstName.style.border = "3px solid red";
        firstName.placeholder = "Username is MANDATORY, please";
        firstName.focus();
    } else
        firstName.style.border = "none";

    if ((password.value === "") || (password.value !== confirmPassword.value)) {
        // console.log("password: ", password.value, "confirmPassword: ", confirmPassword.value);
        e.preventDefault();
        password.value = "";
        password.style.border = "3px solid red";
        password.placeholder = "Passwords MUST match, please";
        password.focus();
        confirmPassword.value = "";
        confirmPassword.style.border = "3px solid red";
        confirmPassword.placeholder = "Passwords MUST match, please";
    } else {
        password.style.border = "none";
        confirmPassword.style.border = "none";
    }

    if (username.value.trim() === "") {
        e.preventDefault();
        username.value = "";
        username.style.border = "3px solid red";
        username.placeholder = "Username is MANDATORY, please";
        username.focus();
    } else
        username.style.border = "none";

    if (username.value.trim().indexOf(" ") >= 0) {
        e.preventDefault();
        username.style.border = "3px solid red";
        username.title = "Username cannot have spaces";
        username.focus();
    } else
        username.style.border = "none";

});
