import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCMk0O-EwviAazQtIhA770W6m9GjQ_t7jU",
  authDomain: "fittrack-pro-1e885.firebaseapp.com",
  projectId: "fittrack-pro-1e885",
  storageBucket: "fittrack-pro-1e885.appspot.com",
  messagingSenderId: "569890112332",
  appId: "1:569890112332:web:c8927182306827d8bd45e9",
  measurementId: "G-98Q7H1LWE5"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const FacebookProvider = new FacebookAuthProvider();