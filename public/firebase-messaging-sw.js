importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js");

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC3iLDUiYTXmnDOkxOPKfkt6e6tMHxw1N4",
  authDomain: "relic-chat-db670.firebaseapp.com",
  projectId: "relic-chat-db670",
  storageBucket: "relic-chat-db670.firebasestorage.app",
  messagingSenderId: "855710163536",
  appId: "1:855710163536:web:bcfd9cb8a6561867216755",
};

try {
  if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Received background message ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/img/IM-message-logo.png",
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
} catch (e) {
  console.log("Firebase SW init skipped (Config not provided).");
}
