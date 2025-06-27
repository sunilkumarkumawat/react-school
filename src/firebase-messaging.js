// firebase-messaging.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 🔑 Your Firebase config (from console)
const firebaseConfig = {
    apiKey: "AIzaSyBM3YMh5ILM9A_MHJd8lnPUqo16KN5K1Kg",
    authDomain: "school-chat-backend.firebaseapp.com",
    projectId: "school-chat-backend",
    storageBucket: "school-chat-backend.firebasestorage.app",
    messagingSenderId: "1080617882660",
    appId: "1:1080617882660:web:0385883299e4ee6ac7b4b1",
    measurementId: "G-KZ9T3VV2LY"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
