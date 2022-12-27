// it validates whether the new password matches to its confirm password variable

const updateButton = document.getElementById("updateButton");
updateButton && updateButton.addEventListener("click", e => {
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    if (newPassword.value !== confirmPassword.value) {
        e.preventDefault();
        newPassword.value = "";
        newPassword.style.border = "3px solid red";
        newPassword.placeholder = "Passwords MUST match, please";
        newPassword.focus();
        confirmPassword.value = "";
        confirmPassword.style.border = "3px solid red";
        confirmPassword.placeholder = "Passwords MUST match, please";
        
        document.getElementById("message").style.display = "none";
    } else {
        newPassword.style.border = "none";
        confirmPassword.style.border = "none";
    }

});