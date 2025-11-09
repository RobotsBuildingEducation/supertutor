import { courseGeneratorModel } from "../firebaseResources/resources";
import { createId } from "../utils/id";
import { buildFallbackBlueprint, titleCase } from "./fallbackContent";
import { normaliseModule } from "./contentUtils";

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

function hydrateCourse(subject, plan) {
  const fallback = buildFallbackBlueprint(subject);
  const blueprint = plan?.blueprint || {};
  const candidateOpeningModule = plan?.openingModule || plan?.modules?.[0];

  const module = normaliseModule(
    fallback.openingModule,
    candidateOpeningModule,
    1
  );

  return {
    id: createId(),
    subject: titleCase(subject),
    title: plan?.title || fallback.title,
    description: plan?.description || fallback.description,
    createdAt: new Date().toISOString(),
    modules: [module],
    blueprint: {
      voice: blueprint.voice || fallback.blueprint.voice,
      storyArc:
        Array.isArray(blueprint.storyArc) && blueprint.storyArc.length
          ? blueprint.storyArc
          : fallback.blueprint.storyArc,
      growthPillars:
        Array.isArray(blueprint.growthPillars) && blueprint.growthPillars.length
          ? blueprint.growthPillars
          : fallback.blueprint.growthPillars,
    },
    history: [],
    nextStage: 2,
  };
}

export async function generateCourse(subject) {
  const trimmedSubject = subject.trim();
  if (!trimmedSubject) {
    throw new Error("Subject prompt is required");
  }

  const prompt = `You are Super Tutor, an AI that crafts adaptive learning adventures. Respond with pure JSON using this schema: {"title": string, "description": string, "blueprint": {"voice": string, "storyArc": string[], "growthPillars": string[]}, "openingModule": {"title": string, "focus": string, "activities": [{"type": "multipleChoice"|"freeResponse"|"project", "prompt": string, "choices"?: string[], "correctAnswer"?: string, "explanation"?: string, "keywords"?: string[], "sampleAnswer"?: string, "celebration"?: string}]}}. The openingModule should contain exactly three activities including one project. Make the journey specific to the subject: ${trimmedSubject}.`;

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
