// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC2A5jcL8TGJTZf7hwHDU7Uz-YhLtUErLA",
    authDomain: "trackie-3e991.firebaseapp.com",
    projectId: "trackie-3e991",
    storageBucket: "trackie-3e991.firebasestorage.app",
    messagingSenderId: "887130545915",
    appId: "1:887130545915:web:026152044af11136079a5e",
    measurementId: "G-88ZLJBNMWF"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
