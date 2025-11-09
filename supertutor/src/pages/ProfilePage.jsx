import { signOut } from "firebase/auth";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebaseResources/resources";

function buildCourseStats(course) {
  const modules = course?.modules || [];
  const totalActivities = modules.reduce(
    (count, module) => count + (module.activities?.length || 0),
    0
  );
  const masteredActivities = modules.reduce(
    (count, module) =>
      count +
      (module.activities || []).filter((activity) => activity.status === "correct")
        .length,
    0
  );
  const attemptedActivities = modules.reduce(
    (count, module) =>
      count +
      (module.activities || []).filter((activity) => activity.status !== "pending")
        .length,
    0
  );

  const progressPercent = totalActivities
    ? Math.round((masteredActivities / totalActivities) * 100)
    : 0;

  let level = "Explorer";
  if (progressPercent >= 80) {
    level = "Trailblazer";
  } else if (progressPercent >= 50) {
    level = "Strategist";
  } else if (progressPercent >= 20) {
    level = "Navigator";
  }

  return {
    totalActivities,
    masteredActivities,
    attemptedActivities,
    progressPercent,
    level,
  };
}

export function ProfilePage({ user, userData }) {
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const handleLaunchTutor = () => {
    navigate("/tutor");
  };

  const courses = userData?.courses || [];
  const courseSummaries = useMemo(
    () =>
      courses.map((course) => ({
        ...buildCourseStats(course),
        id: course.id,
        subject: course.subject,
        title: course.title,
        description: course.description,
        createdAt: course.createdAt,
      })),
    [courses]
  );

  const hasCourses = courseSummaries.length > 0;

  return (
    <div className="profile">
      <div className="profile__card">
        <header className="profile__header">
          <h1>Hey {user.displayName || "there"} 👋</h1>
          <p>
            Your courses evolve with every attempt. Review your levels, celebrate
            streaks, and jump back in when you&apos;re ready to tackle the next
            challenge.
          </p>
        </header>

        <section className="profile__section profile__section--courses">
          <div className="profile__section-heading">
            <h2>Your mastery tracks</h2>
            <button className="profile__launch" onClick={handleLaunchTutor}>
              Change or create courses
            </button>
          </div>

          {hasCourses ? (
            <ul className="profile__course-list">
              {courseSummaries.map((course) => (
                <li key={course.id} className="profile__course">
                  <div className="profile__course-header">
                    <h3>{course.title}</h3>
                    <span className="profile__badge">{course.level}</span>
                  </div>
                  <p className="profile__course-subject">{course.subject}</p>
                  <p className="profile__course-description">
                    {course.description}
                  </p>
                  <div className="profile__progress">
                    <div
                      className="profile__progress-bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={course.progressPercent}
                    >
                      <span
                        className="profile__progress-fill"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                    <p>
                      {course.masteredActivities} of {course.totalActivities} activities mastered
                    </p>
                    <p className="profile__attempts">
                      Attempts logged: {course.attemptedActivities}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="profile__empty">
              <h3>Let&apos;s build your first course</h3>
              <p>
                Define what you want to learn inside the tutor studio and we&apos;ll
                spin up an adaptive journey fueled by Gemini.
              </p>
              <button className="profile__launch" onClick={handleLaunchTutor}>
                Create a course now
              </button>
            </div>
          )}
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
