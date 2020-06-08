import "firebase/analytics";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

/**
 * This file initialises firebase and exports access to firestore and storage.
 *
 * Note: this has been placed in `firebase-config` package to avoid import conflicts with node modules.
 */

const firebaseConfig = {
  apiKey: "AIzaSyDAIxy6Z7Ah5JbNrHwg37__N1NJ97OC4nk",
  authDomain: "this-or-that-prod.firebaseapp.com",
  databaseURL: "https://this-or-that-prod.firebaseio.com",
  projectId: "this-or-that-prod",
  storageBucket: "this-or-that-prod.appspot.com",
  messagingSenderId: "170514740958",
  appId: "1:170514740958:web:6e24c80b6a89edeaaab44f",
  measurementId: "G-WTE9QPS79L",
};

// This must run before any other firebase functions
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const db = firebase.firestore();

const storage = firebase.storage();

const analytics = firebase.analytics();

const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

export { db, storage, analytics, serverTimestamp };
