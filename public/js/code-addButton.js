"use strict"

const registerAddButton = document.getElementById("register-add-button");
registerAddButton && registerAddButton.addEventListener("click", e => {
    e.preventDefault();

    const allInterestsElementsCount = document.getElementsByClassName("interests");
    const currentInterestsCount = allInterestsElementsCount.length;
    console.log("allInterestsElements::: ", currentInterestsCount);
    console.log("addddd+++++++++++", `int${currentInterestsCount}`);
    
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