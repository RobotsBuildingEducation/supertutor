import { Link } from "react-router-dom";

import { AuthDisplay } from "../components/AuthDisplay";

const features = [
  {
    title: "One prompt to launch a course",
    description:
      "Tell Super Tutor what you want to master and Gemini designs a living curriculum in seconds.",
  },
  {
    title: "Adaptive mastery loops",
    description:
      "Every question you answer—right or wrong—reshapes the next challenge so momentum never stops.",
  },
  {
    title: "Progress you can feel",
    description:
      "Track levels, unlock new variants of practice, and celebrate streaks that keep learning playful.",
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

export function LandingPage({ user }) {
  
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
            Describe any outcome—"Master differential equations", "Become a
            storyboard artist", "Understand quantum computing"—and Super Tutor
            pairs Gemini intelligence with rich activities that respond to every
            attempt.
          </p>

          <div className="hero__actions">
            {user ? (
              <Link className="hero__cta" to="/tutor">
                Launch your mastery studio
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
              <dd>Adaptive courses spanning sciences, arts, and careers.</dd>
            </div>
            <div>
              <dt>97%</dt>
              <dd>Learners level up at least one skill tier each week.</dd>
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
              Sign in with Google, describe your dream skill, and Super Tutor
              spins up a smart course with checkpoints, challenges, and
              celebrations tailored to your pace.
            </p>

            {user ? (
              <p className="auth__success">
                You&apos;re signed in! Jump back into your {" "}
                <Link to="/tutor">active course</Link> to keep growing.
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

