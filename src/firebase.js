import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// var defaultApp = admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'https://mystore-eba84.firebaseio.com'
//   });
// var admin = require("firebase-admin");


var firebaseConfig = {
  apiKey: "AIzaSyAqnhSrGuM7aiXsw-VzBKrvGn5gyGAjZ9M",
  authDomain: "reservapp-15975.firebaseapp.com",
  databaseURL: "https://reservapp-15975.firebaseio.com",
  projectId: "reservapp-15975",
  storageBucket: "reservapp-15975.appspot.com",
  messagingSenderId: "507842013915",
  appId: "1:507842013915:web:42ee6879c0e35763dabafe",
  measurementId: "G-E3HK2951SB"
};
// Initialize Firebase
// firebase.analytics();
const fb = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth()
export const db = fb.firestore();

