import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRw_uJlcN-Bb9IVSWXvt88CPRYmnAn1-g",
  authDomain: "gg-project-2.firebaseapp.com",
  projectId: "gg-project-2",
  storageBucket: "gg-project-2.appspot.com",
  messagingSenderId: "291229903461",
  appId: "1:291229903461:web:4a8fdb8fdf19631946348c",
  measurementId: "G-YNHS7REBV1",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
