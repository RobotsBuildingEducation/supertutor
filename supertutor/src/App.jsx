// src/App.jsx
import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

import "./App.css";

import { auth, firestore } from "./firebaseResources/resources";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { TutorPage } from "./pages/TutorPage";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(firestore, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const newUserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
            courses: [],
            activeCourseId: null,
            createdAt: new Date().toISOString(),
          };

          await setDoc(userRef, newUserProfile);
          setUser(firebaseUser);
          setUserData(newUserProfile);
          navigate("/tutor", { replace: true });
        } else {
          const existingUserData = userSnap.data();
          const hydratedUserData = {
            courses: [],
            activeCourseId: null,
            ...existingUserData,
          };
          setUser(firebaseUser);
          setUserData(hydratedUserData);
          navigate("/tutor", { replace: true });
        }
      } else {
        setUser(null);
        setUserData(null);
        navigate("/", { replace: true });
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        Preparing your tutoring experience...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user}>
            <ProfilePage user={user} userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor"
        element={
          <ProtectedRoute user={user}>
            <TutorPage
              user={user}
              userData={userData}
              onUserDataUpdate={setUserData}
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
