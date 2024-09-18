import firebase from 'firebase/compat/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAo6QzsnwTk3cUvhsQXRuvKEYsveRSZ0gM",
  authDomain: "i-media-sharer.firebaseapp.com",
  projectId: "i-media-sharer",
  storageBucket: "i-media-sharer.appspot.com",
  messagingSenderId: "527203090113",
  appId: "1:527203090113:web:3d35e41d4d338e01435e40"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase

