// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBM3YMh5ILM9A_MHJd8lnPUqo16KN5K1Kg",
    authDomain: "school-chat-backend.firebaseapp.com",
    projectId: "school-chat-backend",
    storageBucket: "school-chat-backend.firebasestorage.app",
    messagingSenderId: "1080617882660",
    appId: "1:1080617882660:web:0385883299e4ee6ac7b4b1",
    measurementId: "G-KZ9T3VV2LY"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png", // optional
    });
});
