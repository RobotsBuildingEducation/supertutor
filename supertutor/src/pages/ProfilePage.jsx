import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebaseResources/resources";

export function ProfilePage({ user, userData }) {
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <div className="profile">
      <div className="profile__card">
        <header className="profile__header">
          <h1>Welcome back, {user.displayName || "Learner"}!</h1>
          <p>
            Your personalized mastery plan is ready. Dive into curated lessons,
            real-time coaching, and progress insights tailored to your goals.
          </p>
        </header>

        <section className="profile__section">
          <h2>Your focus</h2>
          <dl>
            <div>
              <dt>Primary goal</dt>
              <dd>{userData?.primaryGoal || "Set during onboarding"}</dd>
            </div>
            <div>
              <dt>First subject</dt>
              <dd>{userData?.focusArea || "Choose your focus"}</dd>
            </div>
            {userData?.customFocus ? (
              <div>
                <dt>Notes for Super Tutor</dt>
                <dd>{userData.customFocus}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="profile__section">
          <h2>Next steps</h2>
          <ul>
            <li>Start a session with Super Tutor to receive your first lesson.</li>
            <li>Track progress and adjust goals anytime.</li>
            <li>Invite collaborators or mentors to review your mastery plan.</li>
          </ul>
        </section>

        <footer className="profile__footer">
          <button className="profile__signout" onClick={handleSignOut}>
            Sign out
          </button>
        </footer>
      </div>
    </div>
  );
}

