import firebase from "firebase";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_30IDgYAxl4pw10kPn5cQOl5WmZVR2nE",
  authDomain: "native-chat-app-81208.firebaseapp.com",
  databaseURL: "https://native-chat-app-81208-default-rtdb.firebaseio.com",
  projectId: "native-chat-app-81208",
  storageBucket: "native-chat-app-81208.appspot.com",
  messagingSenderId: "1093089407865",
  appId: "1:1093089407865:web:8aa8b19e8c2ba522c235a8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
export { database };
