// src/app/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from your project settings
const firebaseConfig = {
  apiKey: "AIzaSyDqBC92jtxNGW3quaCwHGISpR7tS5ETqPY",
  authDomain: "ambulance-track-a1822.firebaseapp.com",
  projectId: "ambulance-track-a1822",
  storageBucket: "ambulance-track-a1822.appspot.com",
  messagingSenderId: "382950433021",
  appId: "1:382950433021:web:f1df4742900c0a38b11e94",
  measurementId: "G-TM7V2H6FJQ"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };