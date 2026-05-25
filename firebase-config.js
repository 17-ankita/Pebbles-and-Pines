import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpKCVZ5wQ4fEMXLCaSDOuY7tzRBO4iUwA",
  authDomain: "pebbles-and-pine-d886c.firebaseapp.com",
  projectId: "pebbles-and-pine-d886c",
  storageBucket: "pebbles-and-pine-d886c.firebasestorage.app",
  messagingSenderId: "19423485128",
  appId: "1:19423485128:web:3500aed477bf3450bf19fd",
  measurementId: "G-TMT64N37ZX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, collection, addDoc, serverTimestamp };