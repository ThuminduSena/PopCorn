import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB_bSdVWItKF_0jekW5VXSxx7nub0jDih8",
    authDomain: "popcorn-27b69.firebaseapp.com",
    projectId: "popcorn-27b69",
    storageBucket: "popcorn-27b69.firebasestorage.app",
    messagingSenderId: "64061784831",
    appId: "1:64061784831:web:dd78baf6f897a5a73dc2ca",
    measurementId: "G-1NE7H14N5Q"
  };
  
  if(!firebaseConfig.apiKey) throw new Error("Missing apiKey");
  if(!firebaseConfig.authDomain) throw new Error("Missing authDomain");
  if(!firebaseConfig.projectId) throw new Error("Missing projectId");
  if(!firebaseConfig.storageBucket) throw new Error("Missing storageBucket");
  if(!firebaseConfig.messagingSenderId) throw new Error("Missing messagingSenderId");
  if(!firebaseConfig.appId) throw new Error("Missing appId");
  if(!firebaseConfig.measurementId) throw new Error("Missing measurementId");


  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth(); 
  const db = firebase.firestore();
  

  export {db,firebase};

 