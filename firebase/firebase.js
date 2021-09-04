import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4gRlHNnUkI89EVAG2h-1jueLKpTazOOY",
  authDomain: "gg-project-eb583.firebaseapp.com",
  projectId: "gg-project-eb583",
  storageBucket: "gg-project-eb583.appspot.com",
  messagingSenderId: "183314668887",
  appId: "1:183314668887:web:4c64fa597c511b4c3f7212",
  measurementId: "G-P2R06N2LWM",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
