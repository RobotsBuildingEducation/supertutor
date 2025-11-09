import { createId } from "../utils/id";

function titleCase(value) {
  if (!value) return "";
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const stageTemplates = [
  {
    label: "Ignition",
    focus:
      "Kick off with core language, mental models, and a fast sense of how this craft shows up in the real world.",
    multipleChoice(subject) {
      return {
        type: "multipleChoice",
        prompt: `Which learner move shows you truly grasp the heartbeat of ${subject}?`,
        choices: [
          `Take a concept from ${subject} and explain it through a vivid real-world moment`,
          "Skim a glossary and assume the words will stick",
          "Copy someone else's solution without reflection",
          "Wait until inspiration strikes before experimenting",
        ],
        correctAnswer: `Take a concept from ${subject} and explain it through a vivid real-world moment`,
        explanation:
          "When you can remix an idea into a scenario, you prove you own the thinking, not just the terminology.",
      };
    },
    freeResponse(subject) {
      return {
        type: "freeResponse",
        prompt: `Describe one misconception about ${subject} that slows people down and how you would reframe it.`,
        keywords: ["misconception", "reframe", subject.toLowerCase()],
        sampleAnswer:
          "Name the myth, reveal why it appears, then craft a reframing that helps a peer unlock the right intuition.",
      };
    },
    project(subject) {
      return {
        type: "project",
        prompt: `Design a tiny artifact that proves you can wield ${subject}. What will you ship, share, or perform?`,
        celebration:
          "Once you lock this in, Gemini will spin up a remix mission to escalate the adventure.",
      };
    },
  },
  {
    label: "Deep Dive",
    focus:
      "Stretch into nuanced situations, contrast approaches, and practice how you diagnose what really matters.",
    multipleChoice(subject) {
      return {
        type: "multipleChoice",
        prompt: `You're mentoring a friend on ${subject}. Which strategy keeps them adaptive under pressure?`,
        choices: [
          "Break the challenge into experiments and reflect on what changes after each iteration",
          "Repeat the same tactic hoping eventually it will work",
          "Ignore feedback because the original plan felt right",
          "Let someone else handle the tricky parts",
        ],
        correctAnswer:
          "Break the challenge into experiments and reflect on what changes after each iteration",
        explanation:
          "Iterative reflection shows you can self-correct, which is how mastery compounds.",
      };
    },
    freeResponse(subject) {
      return {
        type: "freeResponse",
        prompt: `Tell a quick story: how would ${subject} transform a challenge for a teammate or client?`,
        keywords: ["challenge", "impact", "iteration"],
        sampleAnswer:
          `Describe the starting obstacle, the ${subject}-powered intervention, and the measurable shift afterwards.`,
      };
    },
    project(subject) {
      return {
        type: "project",
        prompt: `Craft a sprint plan that applies ${subject} in the wild. What signals will prove it's working?`,
        celebration:
          "Your blueprint becomes a launchpad. Gemini will co-design a sequel mission tuned to your reflections.",
      };
    },
  },
  {
    label: "Remix",
    focus:
      "Invent, remix, and push the craft into daring spaces so your style becomes unmistakable.",
    multipleChoice(subject) {
      return {
        type: "multipleChoice",
        prompt: `Gemini offers three remix routes for ${subject}. Which one unlocks the boldest learning?`,
        choices: [
          "Prototype something unexpected, then solicit critique to evolve it",
          "Copy the last project exactly to save time",
          "Avoid sharing until the work feels perfect",
          "Stick to theory and skip making anything tangible",
        ],
        correctAnswer: "Prototype something unexpected, then solicit critique to evolve it",
        explanation:
          "Brave prototyping plus feedback creates the signal Gemini needs to escalate the adventure.",
      };
    },
    freeResponse(subject) {
      return {
        type: "freeResponse",
        prompt: `If you had to remix ${subject} for a wildly different audience, what would you keep and what would you reinvent?`,
        keywords: ["audience", "remix", "reinvent"],
        sampleAnswer:
          "Call out the non-negotiable principles, then explain the bold twists that make it resonate for the new crew.",
      };
    },
    project(subject) {
      return {
        type: "project",
        prompt: `Propose an "impossible" mission using ${subject}. What's the moonshot and how will you document it?`,
        celebration:
          "Gemini will spin this into a cosmic remix with collaborators, data, or surprises you choose.",
      };
    },
  },
];

function buildStageActivities(subject, stageIndex) {
  const template = stageTemplates[Math.min(stageIndex, stageTemplates.length - 1)];
  const activities = [
    template.multipleChoice(subject),
    template.freeResponse(subject),
    template.project(subject),
  ];

  return activities.map((activity) => ({
    ...activity,
    id: createId(),
    status: "pending",
    attempts: 0,
    history: [],
  }));
}

export function buildFallbackModule(subject, stageIndex) {
  const stageNumber = stageIndex + 1;
  const readableSubject = titleCase(subject);
  const template = stageTemplates[Math.min(stageIndex, stageTemplates.length - 1)];

  return {
    title: `${stageNumber === 1 ? "Mission" : "Chapter"} ${stageNumber}: ${template.label} ${readableSubject}`,
    focus: template.focus,
    activities: buildStageActivities(readableSubject, stageIndex),
  };
}

export function buildFallbackBlueprint(subject) {
  const readableSubject = titleCase(subject);
  return {
    title: `${readableSubject} Mastery Studio`,
    description: `An adaptive studio guided by Gemini that turns ${readableSubject} into instinct through evolving missions.`,
    blueprint: {
      voice: "Encouraging, adventurous, and vividly specific.",
      storyArc: [
        "Ignite core instincts",
        "Practice under playful pressure",
        "Remix with daring experiments",
      ],
      growthPillars: [
        "Reflect out loud so thinking becomes tangible",
        "Prototype quickly and embrace critique",
        "Design artifacts that prove the skill in the wild",
      ],
    },
    openingModule: buildFallbackModule(readableSubject, 0),
  };
}

export { titleCase };
