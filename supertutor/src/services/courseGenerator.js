import { courseGeneratorModel } from "../firebaseResources/resources";
import { createId } from "../utils/id";

function titleCase(value) {
  if (!value) return "";
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildFallbackPlan(subject) {
  const readableSubject = titleCase(subject);
  return {
    title: `${readableSubject} Mastery`,
    description: `An adaptive course crafted with Gemini to make ${readableSubject} second nature.`,
    modules: [
      {
        title: `Launchpad: ${readableSubject} essentials`,
        focus:
          "Anchor the fundamentals, key vocabulary, and fast mental models so every future step feels intuitive.",
        activities: [
          {
            type: "multipleChoice",
            prompt: `Gemini wants to know: what demonstrates a core idea in ${readableSubject}?`,
            choices: [
              `Using ${readableSubject} to explain a real scenario in your own words`,
              "Memorising terminology without applying it",
              "Skipping practice because the topic feels familiar",
              "Waiting for inspiration instead of experimenting",
            ],
            correctAnswer: `Using ${readableSubject} to explain a real scenario in your own words`,
            explanation:
              "Explaining a scenario forces you to connect concepts and shows Gemini you can transfer knowledge on demand.",
          },
          {
            type: "freeResponse",
            prompt: `Describe the biggest misconception people have about ${readableSubject} and how you would reframe it.`,
            keywords: ["misconception", "reframe", subject.toLowerCase()],
            sampleAnswer:
              "Call out the misconception, unpack why it appears, and deliver a fresh framing that unlocks the right intuition.",
          },
        ],
      },
      {
        title: `Skill sprint: ${readableSubject} in action`,
        focus:
          "Apply the skill to new contexts, tune your decision-making, and turn feedback into fuel.",
        activities: [
          {
            type: "multipleChoice",
            prompt: `Gemini wants to know: what demonstrates smart strategy while using ${readableSubject}?`,
            choices: [
              "Breaking down a challenge into smaller experiments and reflecting on each result",
              "Repeating the exact same approach hoping for different results",
              "Ignoring feedback because the plan feels right",
              "Letting someone else solve it entirely",
            ],
            correctAnswer: "Breaking down a challenge into smaller experiments and reflecting on each result",
            explanation:
              "Iterating with intention signals you can navigate ambiguity, a hallmark of mastery.",
          },
          {
            type: "freeResponse",
            prompt: `Share a mini case study: how would ${readableSubject} transform a challenge for a friend or teammate?`,
            keywords: ["challenge", "impact", "iteration"],
            sampleAnswer:
              `Describe the starting problem, the ${readableSubject}-powered approach, and the measurable outcome.`,
          },
        ],
      },
      {
        title: `Creator lab: make ${readableSubject} yours`,
        focus:
          "Design a playful build, experiment, or performance that shows your new confidence.",
        activities: [
          {
            type: "project",
            prompt: `Design a creative milestone that proves your ${readableSubject} superpower. What will you ship, share, or showcase?`,
            celebration:
              "Once you describe your milestone, Gemini will unlock a remix mission so the journey never gets stale.",
          },
        ],
      },
    ],
  };
}

function extractTextFromResponse(result) {
  if (!result || !result.response) {
    return "";
  }

  const parts = result.response.candidates?.flatMap((candidate) =>
    candidate.content?.parts?.map((part) => part.text || "") || []
  );

  return (parts || []).join("\n").trim();
}

function parseJsonPlan(rawText) {
  if (!rawText) return null;

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : rawText;

  try {
    return JSON.parse(candidate);
  } catch (error) {
    return null;
  }
}

function normaliseActivities(fallbackActivities, candidateActivities) {
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
          matchingCandidate.sampleAnswer || matchingCandidate.sample || fallbackActivity.sampleAnswer,
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

function normaliseModules(fallbackModules, candidateModules) {
  const candidateList = Array.isArray(candidateModules) ? candidateModules : [];

  return fallbackModules.map((fallbackModule, index) => {
    const candidate =
      candidateList[index] ||
      candidateList.find(
        (module) =>
          module?.type === fallbackModule.type || module?.title === fallbackModule.title
      );

    const activities = normaliseActivities(
      fallbackModule.activities,
      candidate?.activities
    );

    return {
      id: createId(),
      title: candidate?.title || fallbackModule.title,
      focus: candidate?.focus || fallbackModule.focus,
      activities,
    };
  });
}

function hydrateCourse(subject, plan) {
  const fallbackPlan = buildFallbackPlan(subject);
  const modules = normaliseModules(fallbackPlan.modules, plan?.modules);

  return {
    id: createId(),
    subject: titleCase(subject),
    title: plan?.title || fallbackPlan.title,
    description: plan?.description || fallbackPlan.description,
    createdAt: new Date().toISOString(),
    modules,
  };
}

export async function generateCourse(subject) {
  const trimmedSubject = subject.trim();
  if (!trimmedSubject) {
    throw new Error("Subject prompt is required");
  }

  const prompt = `You are Super Tutor, an AI that builds playful but rigorous learning arcs. Respond with pure JSON using this schema: {"title": string, "description": string, "modules": [{"title": string, "focus": string, "activities": [{"type": "multipleChoice"|"freeResponse"|"project", "prompt": string, "choices"?: string[], "correctAnswer"?: string, "explanation"?: string, "keywords"?: string[], "sampleAnswer"?: string, "celebration"?: string}]}]}. Create exactly three modules. Ensure one module includes a project activity. Base everything on the subject: ${trimmedSubject}.`;

  let plan = null;

  if (courseGeneratorModel) {
    try {
      const result = await courseGeneratorModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const rawText = extractTextFromResponse(result);
      plan = parseJsonPlan(rawText);
    } catch (error) {
      console.error("Gemini course generation failed", error);
    }
  }

  return hydrateCourse(trimmedSubject, plan);
}
