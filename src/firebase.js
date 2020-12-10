import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBbi497Y_ESzRC986cexgBc-_i8wl38Wmg",
  authDomain: "instagram-v0.firebaseapp.com",
  projectId: "instagram-v0",
  storageBucket: "instagram-v0.appspot.com",
  messagingSenderId: "246606916499",
  appId: "1:246606916499:web:ae366e4c92f39e266b1666",
  measurementId: "G-PP7QVGBZSL",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();

export { db, auth, storage };
