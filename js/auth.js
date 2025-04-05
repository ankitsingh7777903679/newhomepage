import { auth, provider } from './firebase-config.js';
import { signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

function initializeAuth() {
    const signInBtn = document.getElementById("signInBtn");
    const userInfo = document.getElementById("userInfo");
    const commentForm = document.querySelector(".comment-form");
    let currentUser = null;

    signInBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                currentUser = result.user;
                signInBtn.style.display = "none";
                userInfo.style.display = "block";
                userInfo.textContent = `Signed in as: ${currentUser.displayName}`;
                commentForm.style.display = "flex";
                commentForm.setAttribute("aria-hidden", "false");
            })
            .catch((error) => {
                console.error("Sign-in error:", error);
                alert(`Failed to sign in: ${error.message}`);
            });
    });

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            signInBtn.style.display = "none";
            userInfo.style.display = "block";
            userInfo.textContent = `Signed in as: ${user.displayName}`;
            commentForm.style.display = "flex";
            commentForm.setAttribute("aria-hidden", "false");
        } else {
            currentUser = null;
            signInBtn.style.display = "block";
            userInfo.style.display = "none";
            commentForm.style.display = "none";
            commentForm.setAttribute("aria-hidden", "true");
        }
    });

    return () => currentUser;
}

export { initializeAuth };