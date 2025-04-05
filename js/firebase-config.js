import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBHewNLmqJPFMpLpvj2amQEapBNX9vZAuU",
    authDomain: "questionbanker-79ff9.firebaseapp.com",
    projectId: "questionbanker-79ff9",
    storageBucket: "questionbanker-79ff9.firebasestorage.app",
    messagingSenderId: "534281169916",
    appId: "1:534281169916:web:44a98c2559cf984527e079",
    measurementId: "G-YTYLDW22PH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider };