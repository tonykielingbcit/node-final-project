"use strict"

// const submitBt = document.getElementById("submitButton");
// const txtArea = document.getElementById("txtArea");
// const message = document.getElementById("message");
// let changesOnTxtArea = false;

// txtArea && txtArea.addEventListener("input", _ => changesOnTxtArea = true );

// // contact message
// submitBt && submitBt.addEventListener("click", e => {
//     if (!changesOnTxtArea)  {
//         e.preventDefault();
//         txtArea.style.border = "4px solid red";
//         message.textContent = "Please, type something.";
//         message.style.color = "red";
//         txtArea.focus();
//     }
// });


// handling comment messages
const openSubmitComment = document.getElementById("open-submit-comment-form");
openSubmitComment && openSubmitComment.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("comment-form").style.display = "block";
    document.getElementById("comment-textarea").focus();
});


const cancelCommentButton = document.getElementById("comment-cancel");
cancelCommentButton && cancelCommentButton.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("comment-form").style.display = "none";
});


const submitCommentButton = document.getElementById("comment-submit");
submitCommentButton && submitCommentButton.addEventListener("click", async e => {
    const MESSAGE_SUCCESS = "Comment has been sent.";
    const MESSAGE_FAIL = "Comment failed. Sorry!";
    const commentText = document.getElementById("comment-textarea");
    const comment = commentText.value.trim();
    console.log("comment= ", comment);
    if (!comment) {
        e.preventDefault();
        commentText.focus();
        commentText.placeholder = "Please, Place your comment. ;)";
    } else if (comment) {
        commentText.disabled = true;
        document.getElementById("comment-buttons").style.display = "none";
        const commentMessage = document.getElementById("comment-message")
        commentMessage.style.display = "block";
        commentMessage.style.borderRadius = "5px";
        
        const afterButton = document.getElementById("comment-after-submit-button");
        
        
        // go to db and insert new data
        // hide buttons and place a message for succes or fail
        try {
            const profileId = document.getElementById("profileId").innerText.trim();
            // console.log("profileId:::::::::: ", profileId);
            // console.log("DateNOW:::::::::: ", Date.now());
            const data = {
                profileId,
                message: comment,
                datePosted: Date.now()
            };
            console.log("data:::::::::", data);
            const sendComment = await fetch("/comments/create", {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => data);

            console.log("sendComment::: ", sendComment);
            // if success
            if (sendComment.success) {
                commentMessage.innerHTML = MESSAGE_SUCCESS;
                commentText.style.backgroundColor = "lightgreen";
                commentMessage.classList.add("comment-message-success");
                afterButton.style.display = "block";
                afterButton.style.margin = "auto";
                afterButton.innerHTML = "Close this box";

            // if fail
            } else {
                throw({message: "Problem sending comment to be "})
                // commentMessage.innerHTML = MESSAGE_FAIL;
                // commentText.style.backgroundColor = "lightcoral";
                // commentMessage.classList.add("comment-message-fail");
                // const tryAgainButton = document.getElementById("comment-after-submit-button");
                // console.log("tryAgainButton= ", tryAgainButton);
                // afterButton.style.display = "block";
                // afterButton.style.margin = "auto";
                // afterButton.innerHTML = "Try Again.";
            }
        } catch (error) {
            console.error("###ERROR: ", error.message || error);
            commentMessage.innerHTML = MESSAGE_FAIL;
            commentText.style.backgroundColor = "lightcoral";
            commentMessage.classList.add("comment-message-fail");
            // const tryAgainButton = document.getElementById("comment-after-submit-button");
            // console.log("tryAgainButton= ", tryAgainButton);
            afterButton.style.display = "block";
            afterButton.style.margin = "auto";
            afterButton.innerHTML = "Try Again.";
        }
    }
});


const commentAfterSubmitButton = document.getElementById("comment-after-submit-button");
commentAfterSubmitButton && commentAfterSubmitButton.addEventListener("click", e => {
    e.preventDefault();
    console.log("e.target.innerHTML: ", e.target.innerHTML);
    const action = e.target.innerHTML;
    if (action === "Close this box")
        return window.location.reload();
    else if (action === "Try Again.") {
        document.getElementById("comment-buttons").style.display = "block";
        const commentMessage = document.getElementById("comment-message")
        commentMessage.style.display = "none";
        const commentText = document.getElementById("comment-textarea");
        commentText.disabled = false;
        document.getElementById("comment-after-submit-button").style.display = "none";
        commentText.style.backgroundColor = "field";
        commentText.focus();
        commentMessage.classList.remove("comment-message-fail");
        const commentButtons = document.getElementById("comment-buttons");
        commentButtons.style.display = "flex";
        commentButtons.style.flexDirection = "column";
    
    }
});
