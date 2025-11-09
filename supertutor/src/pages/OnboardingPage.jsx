import { useState } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { firestore } from "../firebaseResources/resources";

const learningGoals = [
  "Ace my upcoming exams",
  "Advance my career",
  "Master a new hobby",
  "Build a lifelong learning habit",
];

const subjectAreas = [
  "Mathematics",
  "Science",
  "Technology",
  "Languages",
  "Arts",
  "Business",
];

export function OnboardingPage({ user, userData, onUserDataUpdate }) {
  const navigate = useNavigate();
  const [primaryGoal, setPrimaryGoal] = useState(userData?.primaryGoal || "");
  const [focusArea, setFocusArea] = useState(userData?.focusArea || "");
  const [customFocus, setCustomFocus] = useState(userData?.customFocus || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    try {
      const userRef = doc(firestore, "users", user.uid);
      const updates = {
        primaryGoal,
        focusArea,
        customFocus,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updates);
      onUserDataUpdate?.({ ...userData, ...updates });
      navigate("/tutor", { replace: true });
    } catch (err) {
      setError(
        "We couldn\'t save your preferences right now. Please try again in a moment."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <header className="onboarding__header">
          <h1>Let&apos;s personalize your mastery path</h1>
          <p>
            Super Tutor learns about your goals to craft a study sequence that
            keeps you challenged and confident from day one.
          </p>
        </header>

        <form className="onboarding__form" onSubmit={handleSubmit}>
          <label className="onboarding__label">
            What&apos;s your primary goal?
            <select
              required
              value={primaryGoal}
              onChange={(event) => setPrimaryGoal(event.target.value)}
            >
              <option value="" disabled>
                Select a goal
              </option>
              {learningGoals.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </label>

          <label className="onboarding__label">
            Which subject should we focus on first?
            <select
              required
              value={focusArea}
              onChange={(event) => setFocusArea(event.target.value)}
            >
              <option value="" disabled>
                Choose a subject
              </option>
              {subjectAreas.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>

          <label className="onboarding__label">
            Anything specific you want Super Tutor to know?
            <textarea
              rows={4}
              placeholder="Upcoming exams, tricky concepts, preferred learning style..."
              value={customFocus}
              onChange={(event) => setCustomFocus(event.target.value)}
            />
          </label>

          {error && <p className="onboarding__error">{error}</p>}

          <button className="onboarding__submit" type="submit" disabled={isSaving}>
            {isSaving ? "Designing your plan..." : "Save and meet your tutor"}
          </button>
        </form>
      </div>
    </div>
  );
}

