import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export const AuthComponent = StyledFirebaseAuth.default
  ? StyledFirebaseAuth.default
  : StyledFirebaseAuth;

export const firebaseConfig = {
  apiKey: "AIzaSyCVQaGpDfV4nCmtRBFA7myYPsYTK2ApT7o",
  authDomain: "supertutor-93588.firebaseapp.com",
  projectId: "supertutor-93588",
  storageBucket: "supertutor-93588.firebasestorage.app",
  messagingSenderId: "256993244457",
  appId: "1:256993244457:web:d2dac0c57014538dcf3338",
  measurementId: "G-GNSMT09RPD",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};
