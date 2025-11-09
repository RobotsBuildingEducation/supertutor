// src/App.jsx
import { useState, useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

import "./App.css";

import { auth, firestore } from "./firebaseResources/resources";
import { AuthDisplay } from "./components/AuthDisplay";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }

        navigate("/profile");
      } else {
        navigate("/"); // public route
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Find reputable and good work
      <AuthDisplay />
      <div
        style={{
          fontSize: "75%",
          visibility: "visible",
        }}
      >
        ✨ created by{" "}
        <a
          target="_blank"
          href="https://robotsbuildingeducation.com"
          rel="noreferrer"
        >
          rox the AI cofounder
        </a>
      </div>
    </div>
  );
}

export default App;
