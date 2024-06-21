// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEQz6NKL26dJa4RpMt_PUTZndE0CHcyAg",
  authDomain: "simple-multiplayer-2dgame.firebaseapp.com",
  databaseURL: "https://simple-multiplayer-2dgame-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "simple-multiplayer-2dgame",
  storageBucket: "simple-multiplayer-2dgame.appspot.com",
  messagingSenderId: "553428079688",
  appId: "1:553428079688:web:3327e8b5564571e8dd347d",
  measurementId: "G-8NC7R55JWW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const realTimeDatabase = getDatabase(app)

const auth = getAuth(app)

const database = getFirestore(app)

export {auth, realTimeDatabase, database};