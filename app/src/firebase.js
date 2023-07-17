import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.APP_KEY,
  authDomain: "jetflix-mern.firebaseapp.com",
  projectId: "jetflix-mern",
  storageBucket: "jetflix-mern.appspot.com",
  messagingSenderId: "653150423933",
  appId: "1:653150423933:web:dd976dc097bf8bb3a09a14",
  measurementId: "G-03J7EDH3MT",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
