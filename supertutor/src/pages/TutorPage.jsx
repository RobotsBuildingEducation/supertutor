import { useEffect, useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { firestore } from "../firebaseResources/resources";
import { generateCourse as generateCourseFromAI } from "../services/courseGenerator";
import { createId } from "../utils/id";

function evaluateActivity(activity, response) {
  if (activity.type === "multipleChoice") {
    const correct = response === activity.correctAnswer;
    return {
      correct,
      message: correct
        ? "Yes! You picked the mastery move."
        : `Not quite. ${activity.explanation}`,
    };
  }

  if (activity.type === "freeResponse") {
    const normalized = (response || "").toLowerCase();
    const matchedKeywords = (activity.keywords || []).filter((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );
    const correct = matchedKeywords.length >= Math.ceil((activity.keywords || []).length / 2);
    const missing = (activity.keywords || [])
      .filter((keyword) => !normalized.includes(keyword.toLowerCase()))
      .slice(0, 2);

    return {
      correct,
      message: correct
        ? `Powerful! You highlighted ideas like ${matchedKeywords.join(", ")}.`
        : `Try weaving in insights such as ${missing.join(", ")}.`,
    };
  }

  if (activity.type === "project") {
    const correct = Boolean(response && response.trim().length > 20);
    return {
      correct,
      message: correct
        ? "Milestone locked! Ready for Gemini to remix your mission."
        : "Describe your milestone with enough detail so future-you can relive it.",
    };
  }

  return { correct: false, message: "Activity type not supported yet." };
}

function calculateCourseProgress(course) {
  if (!course) {
    return {
      totalActivities: 0,
      masteredActivities: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      completion: 0,
    };
  }

  const modules = course.modules || [];
  let totalActivities = 0;
  let masteredActivities = 0;
  let correctAttempts = 0;
  let incorrectAttempts = 0;

  modules.forEach((module) => {
    (module.activities || []).forEach((activity) => {
      totalActivities += 1;
      if (activity.status === "correct") {
        masteredActivities += 1;
      }

      (activity.history || []).forEach((entry) => {
        if (entry.correct) {
          correctAttempts += 1;
        } else {
          incorrectAttempts += 1;
        }
      });
    });
  });

  const completion = totalActivities
    ? Math.round((masteredActivities / totalActivities) * 100)
    : 0;

  return {
    totalActivities,
    masteredActivities,
    correctAttempts,
    incorrectAttempts,
    completion,
  };
}

export function TutorPage({ user, userData, onUserDataUpdate }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(userData?.courses || []);
  const [activeCourseId, setActiveCourseId] = useState(
    userData?.activeCourseId || null
  );
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [coursePrompt, setCoursePrompt] = useState("");
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [persistError, setPersistError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [responses, setResponses] = useState({});
  const [courseGenerationError, setCourseGenerationError] = useState("");

  useEffect(() => {
    setCourses(userData?.courses || []);
    setActiveCourseId(userData?.activeCourseId || null);
  }, [userData]);

  const activeCourse = useMemo(() => {
    if (!courses.length) {
      return null;
    }

    const foundCourse = courses.find((course) => course.id === activeCourseId);
    return foundCourse || courses[0];
  }, [courses, activeCourseId]);

  useEffect(() => {
    if (!activeCourse) {
      setSelectedModuleId(null);
      return;
    }

    const defaultModule = activeCourse.modules?.[0];
    if (
      defaultModule &&
      !activeCourse.modules.some((module) => module.id === selectedModuleId)
    ) {
      setSelectedModuleId(defaultModule.id);
    }
  }, [activeCourse, selectedModuleId]);

  const selectedModule = useMemo(() => {
    if (!activeCourse) {
      return null;
    }

    return activeCourse.modules?.find((module) => module.id === selectedModuleId);
  }, [activeCourse, selectedModuleId]);

  const progress = useMemo(
    () => calculateCourseProgress(activeCourse),
    [activeCourse]
  );

  const persistCourses = async (updatedCourses, updatedActiveId) => {
    const payload = {
      ...(userData || {}),
      courses: updatedCourses,
      activeCourseId: updatedActiveId,
    };
    onUserDataUpdate?.(payload);

    if (!user) {
      return;
    }

    setIsSaving(true);
    setPersistError("");

    try {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        courses: updatedCourses,
        activeCourseId: updatedActiveId,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      setPersistError(
        "We couldn\'t sync with the cloud right now. Your changes are safe locally and we\'ll retry soon."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCourseGeneration = async (event) => {
    event.preventDefault();
    const trimmedPrompt = coursePrompt.trim();
    if (!trimmedPrompt) {
      setCourseGenerationError("Tell Gemini what to design so we can craft your course.");
      return;
    }

    setIsGeneratingCourse(true);
    setCourseGenerationError("");

    try {
      const newCourse = await generateCourseFromAI(trimmedPrompt);
      const updatedCourses = [...courses, newCourse];
      const newActiveId = newCourse.id;

      setCourses(updatedCourses);
      setActiveCourseId(newActiveId);
      setSelectedModuleId(newCourse.modules[0]?.id || null);
      setResponses({});
      setCoursePrompt("");

      await persistCourses(updatedCourses, newActiveId);
    } catch (error) {
      console.error("Failed to generate course", error);
      setCourseGenerationError(
        "We couldn\'t generate that course just yet. Try a different prompt or retry in a moment."
      );
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handleActivateCourse = async (courseId) => {
    if (courseId === activeCourseId) {
      return;
    }

    setActiveCourseId(courseId);
    const courseToActivate = courses.find((course) => course.id === courseId);
    setSelectedModuleId(courseToActivate?.modules?.[0]?.id || null);
    setResponses({});
    await persistCourses(courses, courseId);
  };

  const handleResponseChange = (activityId, value) => {
    setResponses((prev) => ({ ...prev, [activityId]: value }));
  };

  const handleCheckAnswer = async (moduleId, activityId) => {
    const courseIndex = courses.findIndex((course) => course.id === activeCourse?.id);
    if (courseIndex === -1) {
      return;
    }

    const moduleIndex = courses[courseIndex].modules.findIndex(
      (module) => module.id === moduleId
    );
    if (moduleIndex === -1) {
      return;
    }

    const activityIndex = courses[courseIndex].modules[moduleIndex].activities.findIndex(
      (activity) => activity.id === activityId
    );
    if (activityIndex === -1) {
      return;
    }

    const response = responses[activityId];
    const activity = courses[courseIndex].modules[moduleIndex].activities[activityIndex];

    const { correct, message } = evaluateActivity(activity, response || "");

    const updatedCourses = courses.map((course, index) => {
      if (index !== courseIndex) {
        return course;
      }

      const updatedModules = course.modules.map((module, mIndex) => {
        if (mIndex !== moduleIndex) {
          return module;
        }

        const updatedActivities = module.activities.map((currentActivity, aIndex) => {
          if (aIndex !== activityIndex) {
            return currentActivity;
          }

          const updatedHistory = [
            ...(currentActivity.history || []),
            {
              id: createId(),
              submittedAt: new Date().toISOString(),
              response,
              correct,
            },
          ];

          return {
            ...currentActivity,
            status: correct ? "correct" : "incorrect",
            attempts: (currentActivity.attempts || 0) + 1,
            lastFeedback: message,
            history: updatedHistory,
          };
        });

        return {
          ...module,
          activities: updatedActivities,
        };
      });

      return {
        ...course,
        modules: updatedModules,
      };
    });

    setCourses(updatedCourses);
    await persistCourses(updatedCourses, activeCourse?.id || null);
  };

  const renderActivity = (module, activity) => {
    const response = responses[activity.id] || "";
    const trimmedResponse =
      typeof response === "string" ? response.trim() : "";
    const isCorrect = activity.status === "correct";
    const isIncorrect = activity.status === "incorrect";
    const disableSubmit =
      (activity.type === "multipleChoice" && !response) ||
      (activity.type !== "multipleChoice" && trimmedResponse.length === 0);

    return (
      <li key={activity.id} className="tutor__activity">
        <div className="tutor__activity-header">
          <h4>{activity.type === "project" ? "Creator challenge" : "Challenge"}</h4>
          {activity.attempts ? (
            <span className="tutor__activity-badge">
              {isCorrect ? "Mastered" : "Keep iterating"}
            </span>
          ) : null}
        </div>
        <p className="tutor__activity-prompt">{activity.prompt}</p>

        {activity.type === "multipleChoice" ? (
          <div className="tutor__choices" role="group" aria-label="Possible answers">
            {activity.choices.map((choice) => (
              <button
                key={choice}
                type="button"
                className={`tutor__choice ${
                  response === choice ? "tutor__choice--selected" : ""
                }`}
                onClick={() => handleResponseChange(activity.id, choice)}
                disabled={isCorrect}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : null}

        {activity.type === "freeResponse" ? (
          <textarea
            className="tutor__response"
            value={response}
            onChange={(event) => handleResponseChange(activity.id, event.target.value)}
            placeholder="Capture your thinking so Gemini can adapt the next mission."
            rows={4}
          />
        ) : null}

        {activity.type === "project" ? (
          <textarea
            className="tutor__response"
            value={response}
            onChange={(event) => handleResponseChange(activity.id, event.target.value)}
            placeholder="Describe the artifact, performance, or experiment you&apos;ll create."
            rows={4}
          />
        ) : null}

        <div className="tutor__activity-actions">
          <button
            type="button"
            className="tutor__submit"
            onClick={() => handleCheckAnswer(module.id, activity.id)}
            disabled={disableSubmit}
          >
            {activity.type === "project" ? "Lock milestone" : "Check answer"}
          </button>
          <span className="tutor__attempts">Attempts: {activity.attempts}</span>
        </div>

        {activity.lastFeedback ? (
          <p
            className={`tutor__feedback ${isCorrect ? "tutor__feedback--success" : ""} ${
              isIncorrect ? "tutor__feedback--warning" : ""
            }`}
          >
            {activity.lastFeedback}
          </p>
        ) : null}

        {activity.type === "project" && activity.status === "correct" ? (
          <p className="tutor__celebration">{activity.celebration}</p>
        ) : null}
      </li>
    );
  };

  return (
    <div className="tutor">
      <header className="tutor__topbar">
        <div>
          <h1>Super Tutor studio</h1>
          <p>
            Craft adaptive courses with Gemini, track every win, and let curiosity
            lead the way.
          </p>
        </div>
        <div className="tutor__topbar-actions">
          <button className="tutor__profile" onClick={() => navigate("/profile")}>
            Profile & progress
          </button>
        </div>
      </header>

      <section className="tutor__create">
        <form className="tutor__create-form" onSubmit={handleCourseGeneration}>
          <label htmlFor="coursePrompt" className="tutor__create-label">
            What do you want to master next?
          </label>
          <div className="tutor__create-row">
            <input
              id="coursePrompt"
              type="text"
              value={coursePrompt}
              onChange={(event) => setCoursePrompt(event.target.value)}
              placeholder="Ex: Build cinematic lighting, Speak fluent Italian, Lead high-trust teams"
            />
            <button type="submit" disabled={isGeneratingCourse}>
              {isGeneratingCourse ? "Designing..." : "Generate course"}
            </button>
          </div>
        </form>
        {courseGenerationError ? (
          <p className="tutor__error" role="alert">
            {courseGenerationError}
          </p>
        ) : null}
        <p className="tutor__create-hint">
          Super Tutor uses Gemini to craft modules, remix challenges, and escalate
          missions based on your answers.
        </p>
      </section>

      {courses.length ? (
        <section className="tutor__courses" aria-label="Your courses">
          <div className="tutor__course-list">
            <h2>Course switcher</h2>
            <ul>
              {courses.map((course) => {
                const summary = calculateCourseProgress(course);
                const isActive = course.id === activeCourse?.id;
                return (
                  <li key={course.id} className={`tutor__course ${isActive ? "tutor__course--active" : ""}`}>
                    <button onClick={() => handleActivateCourse(course.id)}>
                      <span className="tutor__course-title">{course.title}</span>
                      <span className="tutor__course-progress">{summary.completion}% complete</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {isSaving ? <p className="tutor__sync">Syncing with the cloud...</p> : null}
            {persistError ? <p className="tutor__error">{persistError}</p> : null}
          </div>

          {activeCourse ? (
            <div className="tutor__workspace">
              <header className="tutor__workspace-header">
                <div>
                  <h2>{activeCourse.title}</h2>
                  <p>{activeCourse.description}</p>
                </div>
                <div className="tutor__workspace-progress" role="status">
                  <span>{progress.completion}% complete</span>
                  <div className="tutor__progress-bar">
                    <span
                      className="tutor__progress-fill"
                      style={{ width: `${progress.completion}%` }}
                    />
                  </div>
                  <div className="tutor__progress-metrics">
                    <span>{progress.masteredActivities} mastered</span>
                    <span>{progress.correctAttempts} wins</span>
                    <span>{progress.incorrectAttempts} retries</span>
                  </div>
                </div>
              </header>

              <div className="tutor__module-picker" role="tablist">
                {activeCourse.modules?.map((module) => {
                  const isSelected = module.id === selectedModuleId;
                  return (
                    <button
                      key={module.id}
                      className={`tutor__module ${isSelected ? "tutor__module--active" : ""}`}
                      onClick={() => setSelectedModuleId(module.id)}
                      role="tab"
                      aria-selected={isSelected}
                    >
                      <h3>{module.title}</h3>
                      <p>{module.focus}</p>
                    </button>
                  );
                })}
              </div>

              {selectedModule ? (
                <div className="tutor__module-detail">
                  <h3>{selectedModule.title}</h3>
                  <p className="tutor__module-focus">{selectedModule.focus}</p>
                  <ul className="tutor__activities">
                    {selectedModule.activities.map((activity) =>
                      renderActivity(selectedModule, activity)
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="tutor__empty">
              <h2>Let&apos;s design a course</h2>
              <p>Tell Super Tutor what you want to learn to unlock modules and rich practice.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="tutor__empty">
          <h2>Define your first mission</h2>
          <p>
            Drop a topic into the generator and Gemini will craft lessons, adaptive
            questions, and playful projects instantly.
          </p>
        </section>
      )}
    </div>
  );
}
