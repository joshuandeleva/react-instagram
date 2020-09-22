import firebase from "firebase"
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDVb8y-uh1Li_yyuWb_o-U3MT4wIDf3hiU",
  authDomain: "instagram-clone-e7098.firebaseapp.com",
  databaseURL: "https://instagram-clone-e7098.firebaseio.com",
  projectId: "instagram-clone-e7098",
  storageBucket: "instagram-clone-e7098.appspot.com",
  messagingSenderId: "389989743003",
  appId: "1:389989743003:web:167b012493cad97a52893e",
  measurementId: "G-8WJR3FK8VV"

})
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export  { db , auth , storage}