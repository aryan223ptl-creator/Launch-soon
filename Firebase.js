// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWuO_POHU2BwhmfFUVOz7LDL1QG4Rj318",
  authDomain: "hypehausstore-64d0a.firebaseapp.com",
  projectId: "hypehausstore-64d0a",
  storageBucket: "hypehausstore-64d0a.firebasestorage.app",
  messagingSenderId: "750047826891",
  appId: "1:750047826891:web:8d99ebdd47baa21b075c4e",
  measurementId: "G-CMG5BEGMEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google Login
async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);

    console.log("Logged in:", result.user);

    alert("Welcome " + result.user.displayName);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// Logout
async function logout() {
  await signOut(auth);
}

// Detect login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User:", user.displayName);
    console.log("Email:", user.email);
  } else {
    console.log("No user logged in");
  }
});

// Make functions available globally
window.googleLogin = googleLogin;
window.logout = logout;

// Export Firestore & Auth
export { auth, db };
