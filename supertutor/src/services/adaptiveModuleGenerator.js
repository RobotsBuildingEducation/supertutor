import { courseGeneratorModel } from "../firebaseResources/resources";
import { buildFallbackModule, titleCase } from "./fallbackContent";
import { normaliseModule } from "./contentUtils";

function summariseHistory(history) {
  if (!history?.length) {
    return "None yet. This is the first mission.";
  }

  const recent = history.slice(-6);
  return recent
    .map((entry) => {
      const sentiment = entry.correct ? "✅" : "🌀";
      return `${sentiment} Stage ${entry.moduleStage}: ${entry.activityType} — ${entry.prompt.trim().slice(0, 120)} (Learner replied: ${
        entry.responseSummary || entry.response
      })`;
    })
    .join("\n");
}

export async function generateAdaptiveModule({
  subject,
  stage,
  blueprint,
  history,
}) {
  const readableSubject = titleCase(subject);
  const fallbackModule = buildFallbackModule(readableSubject, stage - 1);
  let plan = null;

  if (courseGeneratorModel) {
    const voice = blueprint?.voice;
    const storyArc = Array.isArray(blueprint?.storyArc)
      ? blueprint.storyArc.filter(Boolean)
      : [];
    const growthPillars = Array.isArray(blueprint?.growthPillars)
      ? blueprint.growthPillars.filter(Boolean)
      : [];

    const prompt = `You are Super Tutor, an AI guide inventing the next mission for a learner exploring ${readableSubject}. Respond with pure JSON: {"title": string, "focus": string, "activities": [{"type": "multipleChoice"|"freeResponse"|"project", "prompt": string, "choices"?: string[], "correctAnswer"?: string, "explanation"?: string, "keywords"?: string[], "sampleAnswer"?: string, "celebration"?: string}]}. Ensure there are three activities including one project. Maintain the voice: ${voice || "encouraging and adventurous"}. Story arc beats: ${
      storyArc.join(", ") || "ignite, practice, remix"
    }. Growth pillars: ${
      growthPillars.join(", ") ||
      "reflect aloud, iterate boldly, ship tangible artifacts"
    }. Stage number: ${stage}. Recent learner history:\n${summariseHistory(history)}\nCraft something that builds on the learner's momentum and escalates the challenge.`;

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

      const parts = result.response?.candidates?.flatMap((candidate) =>
        candidate.content?.parts?.map((part) => part.text || "") || []
      );
      const raw = (parts || []).join("\n").trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const candidate = jsonMatch ? jsonMatch[0] : raw;
      plan = JSON.parse(candidate);
    } catch (error) {
      console.error("Gemini adaptive module generation failed", error);
      plan = null;
    }
  }

  const candidateModule = plan || {};
  return normaliseModule(fallbackModule, candidateModule, stage);
}
