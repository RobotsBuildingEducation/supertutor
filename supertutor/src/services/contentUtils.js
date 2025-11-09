import { createId } from "../utils/id";

export function normaliseActivities(fallbackActivities, candidateActivities) {
  const candidateList = Array.isArray(candidateActivities)
    ? candidateActivities
    : [];

  return fallbackActivities.map((fallbackActivity) => {
    const matchingCandidate = candidateList.find(
      (activity) => activity?.type === fallbackActivity.type
    );

    if (!matchingCandidate) {
      return {
        ...fallbackActivity,
        id: createId(),
        status: "pending",
        attempts: 0,
        history: [],
      };
    }

    if (fallbackActivity.type === "multipleChoice") {
      const choices = Array.isArray(matchingCandidate.choices)
        ? matchingCandidate.choices.filter(Boolean)
        : Array.isArray(matchingCandidate.options)
        ? matchingCandidate.options.filter(Boolean)
        : fallbackActivity.choices;

      const correctAnswer = choices.includes(matchingCandidate.correctAnswer)
        ? matchingCandidate.correctAnswer
        : fallbackActivity.correctAnswer;

      return {
        ...fallbackActivity,
        prompt: matchingCandidate.prompt || fallbackActivity.prompt,
        choices: choices.length ? choices : fallbackActivity.choices,
        correctAnswer,
        explanation:
          matchingCandidate.explanation || fallbackActivity.explanation,
        id: createId(),
        status: "pending",
        attempts: 0,
        history: [],
      };
    }

    if (fallbackActivity.type === "freeResponse") {
      const keywords = Array.isArray(matchingCandidate.keywords)
        ? matchingCandidate.keywords.filter(Boolean)
        : fallbackActivity.keywords;

      return {
        ...fallbackActivity,
        prompt: matchingCandidate.prompt || fallbackActivity.prompt,
        keywords: keywords.length ? keywords : fallbackActivity.keywords,
        sampleAnswer:
          matchingCandidate.sampleAnswer ||
          matchingCandidate.sample ||
          fallbackActivity.sampleAnswer,
        id: createId(),
        status: "pending",
        attempts: 0,
        history: [],
      };
    }

    if (fallbackActivity.type === "project") {
      return {
        ...fallbackActivity,
        prompt: matchingCandidate.prompt || fallbackActivity.prompt,
        celebration:
          matchingCandidate.celebration || fallbackActivity.celebration,
        id: createId(),
        status: "pending",
        attempts: 0,
        history: [],
      };
    }

    return {
      ...fallbackActivity,
      id: createId(),
      status: "pending",
      attempts: 0,
      history: [],
    };
  });
}

export function normaliseModule(fallbackModule, candidateModule, stageNumber) {
  const activities = normaliseActivities(
    fallbackModule.activities,
    candidateModule?.activities
  );

  return {
    id: createId(),
    title: candidateModule?.title || fallbackModule.title,
    focus: candidateModule?.focus || fallbackModule.focus,
    stage: stageNumber,
    activities,
  };
}
