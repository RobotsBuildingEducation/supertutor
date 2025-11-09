import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const tutorCurriculum = {
  Mathematics: {
    tagline:
      "Turns abstract formulas into intuition, strategy, and exam-ready mastery.",
    topics: {
      "Calculus foundations": {
        overview:
          "Understand how change behaves, why derivatives matter, and how integrals reconnect the whole story.",
        brillianceBoosters: [
          "Uses concept maps that compare algebra, geometry, and calculus viewpoints in one glance.",
          "Blends intuition-first analogies with precise symbolic procedures.",
          "Surfaces the fastest solving patterns for exams and Olympiad-style problems alike.",
        ],
        conceptBreakdown: [
          {
            title: "Concept diagnostic",
            description:
              "We begin with a minute-long recall of rates of change, limits, and area models to calibrate the lesson.",
          },
          {
            title: "Intuition reboot",
            description:
              "We model derivatives as hyper-responsive slope sensors and integrals as accumulation trackers that reverse the sensor.",
          },
          {
            title: "Technique upgrade",
            description:
              "Power, product, and chain rules are organized into a decision grid so you always know the fastest rule to apply.",
          },
        ],
        sessionFlow: [
          {
            title: "Preview",
            description:
              "Skim a visual of how tiny input nudges change the curve and predict the derivative shape before calculating.",
          },
          {
            title: "Coached practice",
            description:
              "Tackle a derivative, narrate your reasoning, and let the tutor fill any gaps instantly.",
          },
          {
            title: "Concept stretch",
            description:
              "Flip the process: start from a derivative graph and reconstruct the original function's behavior.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "Differentiate f(x) = 3x^2 - 5x + 4. Explain which rule you used for each term.",
            answers: ["6x - 5", "6x-5"],
            hints: [
              "Use the power rule term-by-term. The derivative of ax^n is n·a·x^(n-1).",
            ],
            masteryMove:
              "Try describing how the derivative changes when x increases by 0.1 without doing full algebra.",
          },
          {
            prompt:
              "The slope of a curve is 4 when x = 2. Estimate the function's value change if x increases to 2.02.",
            answers: ["0.08", "0.08 units", "0.08 unit"],
            hints: [
              "Use the linear approximation: Δf ≈ f'(a) · Δx. What's Δx here?",
            ],
            masteryMove:
              "Connect the estimate to a real scenario: imagine velocity being 4 m/s and predict displacement.",
          },
          {
            prompt:
              "You know F'(x) = 6x - 5. Build one possible original function F(x).",
            answers: ["3x^2 - 5x + C", "3x^2 - 5x + c", "3x^2-5x + C"],
            hints: [
              "Integrate each term of 6x - 5 separately. Don't forget the family constant.",
            ],
            masteryMove:
              "How would the graph shift if the constant were 12? Describe without plotting.",
          },
        ],
        challengeScenarios: [
          "Sketch the rough shape of a function whose derivative is always negative but approaches zero.",
          "Design a mini-experiment that uses real data to approximate a derivative using a spreadsheet.",
        ],
        enrichment:
          "Explore how optimization problems convert real-world constraints into calculus-ready equations in minutes.",
      },
      "Probability intuition": {
        overview:
          "Master the language of uncertainty, from quick mental estimates to Bayesian updates that refine your beliefs.",
        brillianceBoosters: [
          "Turns percent, fraction, and odds formats into an interchangeable toolkit.",
          "Highlights which probability rules unlock shortcuts on standardized tests.",
          "Teaches how to narrate randomness so stakeholders trust your conclusions.",
        ],
        conceptBreakdown: [
          {
            title: "Anchoring story",
            description:
              "We ground the lesson in a real scenario—launch reliability for a new product rollout.",
          },
          {
            title: "Rule web",
            description:
              "Additive, multiplicative, and conditional rules are organized into a decision web you can recall quickly.",
          },
          {
            title: "Sanity checks",
            description:
              "You learn quick heuristics to validate whether an answer is realistic before submitting it.",
          },
        ],
        sessionFlow: [
          {
            title: "Scenario setup",
            description:
              "Translate a narrative into defined events A and B with clear complements.",
          },
          {
            title: "Compute and compare",
            description:
              "Calculate probabilities in two different ways to ensure consistency.",
          },
          {
            title: "Communicate the insight",
            description:
              "Summarize the result for a teammate with limited statistical background.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "A feature has a 0.3 chance of delighting users and a 0.5 chance of meeting expectations. What's the probability it fails to meet expectations?",
            answers: ["0.5", "50%", "0.5 probability", "0.5 chance"],
            hints: ["Probabilities must sum to 1. What's 1 - 0.5?"],
            masteryMove:
              "Explain whether the delight rate changes your answer and why.",
          },
          {
            prompt:
              "Events A and B are independent with P(A)=0.4 and P(B)=0.25. What's P(A ∩ B)?",
            answers: ["0.1", "0.10", "0.100"],
            hints: ["Independence means multiply the probabilities."],
            masteryMove:
              "Describe a real example of independent events that match these numbers.",
          },
        ],
        challengeScenarios: [
          "Design a two-step hiring funnel and compute the probability someone passes both stages.",
          "When would the additive rule overcount? Build an example and correct it with inclusion-exclusion.",
        ],
        enrichment:
          "Apply Bayesian updating to decide whether to roll back a feature after receiving mixed feedback.",
      },
    },
  },
  Science: {
    tagline: "Transforms complex systems into mental models you can explain in any boardroom or lab.",
    topics: {
      "Cellular energy systems": {
        overview:
          "Track how glucose becomes ATP, why mitochondria orchestrate each stage, and where inefficiencies arise.",
        brillianceBoosters: [
          "Uses layered diagrams that connect macroscopic energy use to microscopic processes.",
          "Links every step in cellular respiration to a 'why it matters' business or athletic scenario.",
          "Compares aerobic and anaerobic strategies using strategy tables.",
        ],
        conceptBreakdown: [
          {
            title: "Energy audit",
            description:
              "Quantify energy intake and output at each respiration stage to spot the biggest ATP gains.",
          },
          {
            title: "Pathway narration",
            description:
              "Walk through glycolysis, Krebs cycle, and the electron transport chain with cause-and-effect storytelling.",
          },
          {
            title: "Efficiency levers",
            description:
              "Identify how oxygen supply, enzyme availability, and training state shift ATP yield.",
          },
        ],
        sessionFlow: [
          {
            title: "Concept sketch",
            description:
              "Redraw the respiration pathway with your own annotations while the tutor checks for misunderstandings.",
          },
          {
            title: "Case comparison",
            description:
              "Contrast muscle use in a 100m sprint versus a marathon to see pathway dominance.",
          },
          {
            title: "Transfer",
            description:
              "Translate the biology into advice for a coach planning interval workouts.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "During the electron transport chain, which molecule directly donates electrons to begin the process?",
            answers: ["NADH", "nadh"],
            hints: [
              "Think about the electron carriers generated in glycolysis and the Krebs cycle.",
            ],
            masteryMove:
              "Compare NADH's role with FADH2 and explain why their ATP outputs differ.",
          },
          {
            prompt:
              "In anaerobic conditions, what happens to pyruvate so that glycolysis can keep running?",
            answers: ["It is converted to lactate", "converted to lactate", "lactate", "it becomes lactate"],
            hints: [
              "Consider how NAD+ is regenerated when oxygen is limited.",
            ],
            masteryMove:
              "Describe how a sprinter could use this knowledge to structure rest intervals.",
          },
        ],
        challengeScenarios: [
          "Propose a presentation slide that explains mitochondrial density advantages to non-scientists.",
          "Create a scoreboard comparing ATP yield per glucose with and without oxygen.",
        ],
        enrichment:
          "Investigate how intermittent hypoxia training manipulates mitochondrial efficiency in elite athletes.",
      },
      "Climate systems modeling": {
        overview:
          "Decode how energy balance, feedback loops, and data modeling predict climate futures with precision.",
        brillianceBoosters: [
          "Maps every feedback loop with icons so you remember directionality instantly.",
          "Explains model uncertainty using analogies to product roadmaps and forecasts.",
          "Shows how to turn raw datasets into insights policymakers can act on.",
        ],
        conceptBreakdown: [
          {
            title: "System baseline",
            description:
              "Clarify incoming solar radiation, albedo, and greenhouse trapping using the energy budget model.",
          },
          {
            title: "Feedback anatomy",
            description:
              "Dissect water vapor, ice-albedo, and cloud feedbacks to see why small changes amplify outcomes.",
          },
          {
            title: "Model literacy",
            description:
              "Interpret climate model outputs, confidence intervals, and ensemble approaches with data storytelling.",
          },
        ],
        sessionFlow: [
          {
            title: "Map the system",
            description:
              "Create a quick causal loop diagram while the tutor challenges each arrow you draw.",
          },
          {
            title: "Stress-test a scenario",
            description:
              "Adjust emissions assumptions and predict how temperature projections shift.",
          },
          {
            title: "Communicate impact",
            description:
              "Craft a persuasive briefing tailored to executives, students, or policymakers.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "If Earth's albedo decreases, what happens to the amount of absorbed solar energy?",
            answers: [
              "It increases",
              "increase",
              "absorbed energy increases",
              "more energy is absorbed",
            ],
            hints: ["Lower albedo means less reflection."],
            masteryMove:
              "Relate this to melting sea ice and global temperature trends.",
          },
          {
            prompt:
              "Name one positive feedback loop that accelerates warming.",
            answers: ["water vapor", "ice-albedo", "permafrost thaw", "cloud feedback"],
            hints: [
              "Think of a process where warming triggers something that causes even more warming.",
            ],
            masteryMove:
              "Explain how you would visualize this feedback for a city council presentation.",
          },
        ],
        challengeScenarios: [
          "Debate how to balance mitigation versus adaptation budgets using model outputs.",
          "Outline a data collection plan to improve regional climate predictions.",
        ],
        enrichment:
          "Examine how climate models borrow techniques from financial risk simulations to manage uncertainty.",
      },
    },
  },
  Humanities: {
    tagline:
      "Builds powerful narratives, critical thinking, and communication across eras and cultures.",
    topics: {
      "World history synthesis": {
        overview:
          "Connects major world turning points and highlights the systems thinking needed to interpret them.",
        brillianceBoosters: [
          "Combines timelines, cause-effect chains, and counterfactual thinking in one frame.",
          "Teaches how to compare historian perspectives rapidly.",
          "Equips you to present nuanced arguments in writing or speech.",
        ],
        conceptBreakdown: [
          {
            title: "Anchor event",
            description:
              "Start with a pivotal event like the Industrial Revolution and map its economic, political, and cultural ripples.",
          },
          {
            title: "Multiple lenses",
            description:
              "Contrast perspectives from different regions and social groups to surface hidden assumptions.",
          },
          {
            title: "Evidence craft",
            description:
              "Practice weaving primary sources and data into a compelling argument.",
          },
        ],
        sessionFlow: [
          {
            title: "Timeline remix",
            description:
              "Rebuild the sequence of events highlighting catalysts and consequences.",
          },
          {
            title: "Perspective swap",
            description:
              "Argue the same event from two different viewpoints while the tutor challenges your reasoning.",
          },
          {
            title: "Synthesis brief",
            description:
              "Compose a concise thesis statement backed by three categories of evidence.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "Name one technological advancement that propelled the Industrial Revolution and explain its impact in a sentence.",
            answers: [
              "steam engine",
              "the steam engine",
              "spinning jenny",
              "power loom",
            ],
            hints: [
              "Think about inventions that multiplied production speed or energy availability.",
            ],
            masteryMove:
              "Connect the advancement to a modern innovation playing a similar role.",
          },
          {
            prompt:
              "Provide one consequence of the Columbian Exchange for Europe or the Americas.",
            answers: [
              "population growth",
              "disease spread",
              "exchange of crops",
              "economic expansion",
              "spread of smallpox",
            ],
            hints: ["Consider biological, economic, or cultural effects."],
            masteryMove:
              "Argue whether the consequence created more winners or losers.",
          },
        ],
        challengeScenarios: [
          "Draft an opening paragraph comparing two revolutions in under 120 words.",
          "Curate three sources that challenge a dominant historical narrative.",
        ],
        enrichment:
          "Investigate how modern supply chains mirror mercantilist networks in surprising ways.",
      },
      "Persuasive communication": {
        overview:
          "Craft arguments that resonate emotionally and logically across audiences.",
        brillianceBoosters: [
          "Turns rhetorical devices into a playbook you can deploy intentionally.",
          "Provides instant rewrites that elevate clarity, tone, and memorability.",
          "Shows how to align message, medium, and audience in minutes.",
        ],
        conceptBreakdown: [
          {
            title: "Audience decoding",
            description:
              "Profile stakeholders quickly to understand their motivations and potential objections.",
          },
          {
            title: "Message architecture",
            description:
              "Organize ethos, pathos, and logos so each paragraph hits with purpose.",
          },
          {
            title: "Delivery polish",
            description:
              "Use vocal variety, visuals, and pacing to reinforce retention.",
          },
        ],
        sessionFlow: [
          {
            title: "Set the stage",
            description:
              "Define the action you want your audience to take, then reverse engineer supporting points.",
          },
          {
            title: "Draft and iterate",
            description:
              "Co-write a core message, measure its resonance, and improve with data-backed tweaks.",
          },
          {
            title: "Rehearse and refine",
            description:
              "Practice delivery while the tutor tracks pacing, emphasis, and clarity.",
          },
        ],
        guidedPractice: [
          {
            prompt:
              "Write a one-sentence call to action encouraging a school board to fund STEM labs.",
            answers: ["varies"],
            hints: [
              "Blend impact on students (pathos) with outcomes (logos) and trust-building (ethos).",
            ],
            masteryMove:
              "Identify which rhetorical appeal you leaned on most and why.",
          },
          {
            prompt:
              "List two questions you should research before pitching a new initiative to executives.",
            answers: ["varies"],
            hints: [
              "Consider stakeholder priorities, risk tolerance, and existing metrics.",
            ],
            masteryMove:
              "Explain how answers to those questions would shape your opening story.",
          },
        ],
        challengeScenarios: [
          "Transform a technical update into a two-minute inspirational briefing.",
          "Design a feedback loop to measure speech effectiveness the next day.",
        ],
        enrichment:
          "Study how top communicators reuse narrative arcs to stay consistent across platforms.",
      },
    },
  },
};

const confidenceLabels = {
  1: "I need to start from the foundation",
  2: "I can follow with guided support",
  3: "I feel steady but want sharper instincts",
  4: "I\'m ready for advanced twists",
  5: "I want Olympic-level challenges",
};

function normalizeAnswer(value) {
  if (typeof value === "number") {
    return value;
  }

  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9%\s\.\-]/g, "")
    .replace(/\s+/g, " ");
}

export function TutorPage({ user, userData }) {
  const navigate = useNavigate();

  const subjectNames = Object.keys(tutorCurriculum);
  const preferredSubject = userData?.focusArea;
  const initialSubject = subjectNames.includes(preferredSubject)
    ? preferredSubject
    : subjectNames[0];

  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const topicNames = Object.keys(tutorCurriculum[selectedSubject].topics);
  const [selectedTopic, setSelectedTopic] = useState(topicNames[0]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [learnerAnswer, setLearnerAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [flowProgress, setFlowProgress] = useState(
    () => new Array(tutorCurriculum[selectedSubject].topics[selectedTopic].sessionFlow.length).fill(false),
  );

  useEffect(() => {
    const firstTopic = Object.keys(tutorCurriculum[selectedSubject].topics)[0];
    setSelectedTopic(firstTopic);
  }, [selectedSubject]);

  useEffect(() => {
    const currentFlowLength =
      tutorCurriculum[selectedSubject].topics[selectedTopic].sessionFlow.length;
    setFlowProgress(new Array(currentFlowLength).fill(false));
    setPracticeIndex(0);
    setLearnerAnswer("");
    setFeedback(null);
    setShowHint(false);
  }, [selectedSubject, selectedTopic]);

  const currentSubject = tutorCurriculum[selectedSubject];
  const currentTopic = currentSubject.topics[selectedTopic];
  const practiceItems = currentTopic.guidedPractice;
  const activePractice = practiceItems[practiceIndex % practiceItems.length];

  const dynamicCoaching = useMemo(() => {
    if (confidence <= 2) {
      return {
        focus: "We\'ll slow the pacing, double-check foundations, and use visuals before symbols.",
        support:
          "Expect the tutor to ask clarifying questions and supply worked examples you can annotate.",
        stretch:
          "Once steady, we\'ll convert one of today\'s problems into a teach-back moment to lock it in.",
      };
    }

    if (confidence === 3) {
      return {
        focus: "You\'ll alternate between instructor-guided walkthroughs and independent attempts.",
        support: "Instant hints appear only when you articulate where you feel uncertain.",
        stretch:
          "We\'ll include one challenge scenario that forces you to apply the idea in a new context.",
      };
    }

    if (confidence === 4) {
      return {
        focus: "We\'ll accelerate through basics and spend time on pattern recognition and shortcuts.",
        support:
          "Expect quick diagnostics and Socratic questioning that stress-tests your reasoning.",
        stretch:
          "You\'ll close the session by designing a mini-project or explanation for someone else.",
      };
    }

    return {
      focus:
        "We\'ll treat you like a co-instructor, co-designing advanced problems and debating solution paths.",
      support:
        "Feedback will highlight elegance, generalizability, and how to communicate the why behind the method.",
      stretch:
        "You\'ll leave with a moonshot challenge that extends beyond standard curricula.",
    };
  }, [confidence]);

  const celebrationMessage = useMemo(() => {
    if (!userData?.primaryGoal) {
      return "Let\'s engineer breakthroughs one session at a time.";
    }

    return `Every move today is tuned to your goal: ${userData.primaryGoal}.`;
  }, [userData?.primaryGoal]);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleCheckAnswer = () => {
    if (!activePractice) {
      return;
    }

    const normalizedLearner = normalizeAnswer(learnerAnswer);

    const isCorrect = activePractice.answers.some((answer) => {
      if (typeof answer === "number") {
        const numericResponse = parseFloat(learnerAnswer);
        if (Number.isNaN(numericResponse)) {
          return false;
        }
        return Math.abs(numericResponse - answer) < 1e-6;
      }

      if (answer === "varies") {
        return learnerAnswer.trim().length > 0;
      }

      return normalizeAnswer(answer) === normalizedLearner;
    });

    if (isCorrect) {
      setFeedback({
        status: "correct",
        message:
          "Brilliant! Your reasoning aligns with expert solutions. Ready for a tougher variation?",
      });
    } else {
      setFeedback({
        status: "incorrect",
        message:
          "Not quite yet. Pinpoint the exact step that felt shaky and tap 'Reveal hint' for targeted support.",
      });
    }
  };

  const handleNextPractice = () => {
    setPracticeIndex((index) => (index + 1) % practiceItems.length);
    setLearnerAnswer("");
    setFeedback(null);
    setShowHint(false);
  };

  const handleToggleFlow = (index) => {
    setFlowProgress((progress) => {
      const next = [...progress];
      next[index] = !next[index];
      return next;
    });
  };

  const completedSteps = flowProgress.filter(Boolean).length;
  const flowCompletion = Math.round((completedSteps / flowProgress.length) * 100);

  return (
    <div className="tutor">
      <div className="tutor__background" aria-hidden="true" />
      <header className="tutor__header">
        <button
          className="tutor__back"
          type="button"
          onClick={() => navigate("/profile")}
        >
          ← Back to profile
        </button>
        <div>
          <p className="tutor__welcome">
            {user?.displayName ? `Hi ${user.displayName.split(" ")[0]},` : "Hi there,"} {celebrationMessage}
          </p>
          <h1>
            Super Tutor Session
            <span className="tutor__subject"> · {selectedSubject}</span>
          </h1>
          <p className="tutor__tagline">{currentSubject.tagline}</p>
        </div>
      </header>

      <main className="tutor__layout">
        <section className="tutor__panel tutor__panel--controls" aria-label="Session controls">
          <div className="tutor__selectors">
            <label className="tutor__selector">
              <span>Subject focus</span>
              <select value={selectedSubject} onChange={handleSubjectChange}>
                {subjectNames.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="tutor__selector">
              <span>Deep dive topic</span>
              <select value={selectedTopic} onChange={handleTopicChange}>
                {Object.keys(currentSubject.topics).map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="tutor__confidence">
            <label htmlFor="confidence-slider">How confident do you feel right now?</label>
            <input
              id="confidence-slider"
              type="range"
              min="1"
              max="5"
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
            />
            <p className="tutor__confidence-label">{confidenceLabels[confidence]}</p>
          </div>

          <div className="tutor__coaching">
            <h2>Session calibration</h2>
            <ul>
              <li>
                <strong>Focus:</strong> {dynamicCoaching.focus}
              </li>
              <li>
                <strong>Support:</strong> {dynamicCoaching.support}
              </li>
              <li>
                <strong>Stretch:</strong> {dynamicCoaching.stretch}
              </li>
            </ul>
          </div>

          <div className="tutor__flow">
            <div className="tutor__flow-header">
              <h2>Session flow</h2>
              <span className="tutor__flow-progress">{flowCompletion}% complete</span>
            </div>
            <ol>
              {currentTopic.sessionFlow.map((step, index) => (
                <li key={step.title} className={flowProgress[index] ? "is-complete" : undefined}>
                  <button type="button" onClick={() => handleToggleFlow(index)}>
                    {flowProgress[index] ? "✓" : "○"} {step.title}
                  </button>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tutor__panel tutor__panel--lesson" aria-label="Lesson intelligence">
          <div className="tutor__overview">
            <h2>Why this matters</h2>
            <p>{currentTopic.overview}</p>
          </div>

          <div className="tutor__insights">
            <h3>How Super Tutor amplifies this topic</h3>
            <ul>
              {currentTopic.brillianceBoosters.map((boost) => (
                <li key={boost}>{boost}</li>
              ))}
            </ul>
          </div>

          <div className="tutor__concepts">
            <h3>Concept breakdown</h3>
            <div className="tutor__concept-grid">
              {currentTopic.conceptBreakdown.map((concept) => (
                <article key={concept.title}>
                  <h4>{concept.title}</h4>
                  <p>{concept.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="tutor__enrichment">
            <h3>Beyond today</h3>
            <p>{currentTopic.enrichment}</p>
          </div>
        </section>

        <section className="tutor__panel tutor__panel--practice" aria-label="Practice studio">
          <div className="tutor__practice-card">
            <header>
              <h2>Guided practice</h2>
              <p>
                Prompt {practiceIndex + 1} of {practiceItems.length}
              </p>
            </header>
            <p className="tutor__practice-prompt">{activePractice.prompt}</p>
            <textarea
              value={learnerAnswer}
              onChange={(event) => setLearnerAnswer(event.target.value)}
              rows={4}
              placeholder="Type your reasoning or solution here."
            />

            <div className="tutor__practice-actions">
              <button type="button" onClick={handleCheckAnswer}>
                Check my approach
              </button>
              <button type="button" onClick={() => setShowHint(true)}>
                Reveal hint
              </button>
              <button type="button" onClick={handleNextPractice}>
                Try another prompt
              </button>
            </div>

            {showHint ? <p className="tutor__hint">Hint: {activePractice.hints[0]}</p> : null}
            {feedback ? (
              <p className={`tutor__feedback tutor__feedback--${feedback.status}`}>
                {feedback.message}
              </p>
            ) : null}
            <p className="tutor__mastery">Mastery move: {activePractice.masteryMove}</p>
          </div>

          <div className="tutor__challenges">
            <h3>Stretch challenges</h3>
            <ul>
              {currentTopic.challengeScenarios.map((scenario) => (
                <li key={scenario}>{scenario}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
