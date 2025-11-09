import { Link } from "react-router-dom";

import { AuthDisplay } from "../components/AuthDisplay";

const features = [
  {
    title: "Instant mastery",
    description:
      "Super Tutor understands every curriculum and adapts its teaching style to match how you learn best.",
  },
  {
    title: "Human + AI synergy",
    description:
      "Personalized lessons, live explanations, and practice plans that improve after every interaction.",
  },
  {
    title: "Results that compound",
    description:
      "From exam prep to creative pursuits, learners see measurable progress in days—not months.",
  },
];

const testimonials = [
  {
    quote:
      "I went from struggling with calculus to scoring in the 98th percentile. Super Tutor never gets tired of my questions!",
    author: "Priya, university student",
  },
  {
    quote:
      "My entire team uses it to upskill on new technologies. It's like having a subject-matter expert available 24/7.",
    author: "Marcos, engineering lead",
  },
  {
    quote:
      "As a parent, I finally have a tutor that keeps my daughter excited about learning every single day.",
    author: "Angela, parent",
  },
];

export function LandingPage({ user, userData }) {
  const hasCompletedOnboarding = Boolean(userData?.onboardingComplete);

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />

      <header className="hero">
        <nav className="nav" aria-label="Primary">
          <div className="nav__brand">Super Tutor</div>
          <div className="nav__actions">
            <a className="nav__link" href="#features">
              Why it works
            </a>
            <a className="nav__link" href="#signup">
              Start learning
            </a>
          </div>
        </nav>

        <div className="hero__content">
          <span className="hero__eyebrow">Your limitless educator</span>
          <h1 className="hero__title">
            The tutor that outperforms every human in every subject.
          </h1>
          <p className="hero__subtitle">
            Super Tutor blends advanced reasoning with a deep teaching toolkit.
            It diagnoses knowledge gaps instantly, crafts dynamic lessons, and
            coaches you through breakthroughs in record time.
          </p>

          <div className="hero__actions">
            {user ? (
              <Link
                className="hero__cta"
                to={hasCompletedOnboarding ? "/profile" : "/onboarding"}
              >
                {hasCompletedOnboarding
                  ? "Continue to your mastery plan"
                  : "Resume onboarding"}
              </Link>
            ) : (
              <a className="hero__cta" href="#signup">
                Sign in to get your tutor
              </a>
            )}
            <p className="hero__note">
              No contracts. Just the fastest way to understand anything.
            </p>
          </div>

          <dl className="hero__metrics">
            <div>
              <dt>500K+</dt>
              <dd>Personalized lessons delivered across 120 subjects.</dd>
            </div>
            <div>
              <dt>97%</dt>
              <dd>Learners report accelerated progress within two weeks.</dd>
            </div>
            <div>
              <dt>24/7</dt>
              <dd>Always-on coaching, instant explanations, zero wait.</dd>
            </div>
          </dl>
        </div>
      </header>

      <main>
        <section id="features" className="features">
          <h2>What makes Super Tutor unstoppable?</h2>
          <div className="features__grid">
            {features.map((feature) => (
              <article key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials" aria-label="Testimonials">
          {testimonials.map((testimonial) => (
            <figure className="testimonials__card" key={testimonial.author}>
              <blockquote className="testimonials__quote">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="testimonials__author">
                {testimonial.author}
              </figcaption>
            </figure>
          ))}
        </section>

        <section id="signup" className="auth">
          <div className="auth__content">
            <h2>Ready to learn faster than ever?</h2>
            <p>
              Sign in with Google to create your profile. New learners are
              guided through an onboarding experience so Super Tutor can craft a
              bespoke mastery path.
            </p>

            {user ? (
              <p className="auth__success">
                You&apos;re signed in! Head to your {" "}
                <Link to={hasCompletedOnboarding ? "/profile" : "/onboarding"}>
                  {hasCompletedOnboarding ? "profile" : "onboarding"}
                </Link>{" "}
                to keep going.
              </p>
            ) : (
              <div className="auth__actions">
                <div className="google-signin-button">
                  <AuthDisplay />
                </div>
                <p className="auth__message">
                  We&apos;ll tailor your tutoring in under 60 seconds.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          ✨ created by <a href="https://robotsbuildingeducation.com">rox the AI cofounder</a>
        </p>
      </footer>
    </div>
  );
}

