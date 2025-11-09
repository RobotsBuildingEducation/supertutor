import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function App() {
  const [authMessage, setAuthMessage] = useState('')
  const [userSignedIn, setUserSignedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  const signInSectionRef = useRef(null)
  const buttonRef = useRef(null)

  const handleCredentialResponse = useCallback((credentialResponse) => {
    if (!credentialResponse?.credential) {
      setAuthMessage('Google sign-in failed. Please try again.')
      setUserSignedIn(false)
      return
    }

    try {
      const payloadSegment = credentialResponse.credential.split('.')[1]
      if (payloadSegment && typeof window !== 'undefined' && typeof window.atob === 'function') {
        const decodedPayload = JSON.parse(window.atob(payloadSegment))
        const decodedName = decodedPayload?.name || decodedPayload?.email || ''
        setUserName(decodedName)
      } else {
        setUserName('')
      }
    } catch (error) {
      console.warn('Unable to decode Google credential payload', error)
      setUserName('')
    }

    setUserSignedIn(true)
    setAuthMessage('')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.google?.accounts?.id) {
      setGoogleScriptLoaded(true)
      return
    }

    const existingScript = document.querySelector(
      'script[data-google-identity-service="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => setGoogleScriptLoaded(true), {
        once: true,
      })
      existingScript.addEventListener(
        'error',
        () =>
          setAuthMessage(
            'Unable to load Google sign-in. Please refresh the page and try again.',
          ),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentityService = 'true'
    script.onload = () => setGoogleScriptLoaded(true)
    script.onerror = () =>
      setAuthMessage('Unable to load Google sign-in. Please refresh the page and try again.')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!googleScriptLoaded || !buttonRef.current) {
      return
    }

    if (!window.google?.accounts?.id) {
      setAuthMessage('Google sign-in is unavailable right now. Please try again later.')
      return
    }

    if (!GOOGLE_CLIENT_ID) {
      setAuthMessage('Add VITE_GOOGLE_CLIENT_ID to your environment to enable Google sign-in.')
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
      })

      buttonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 320,
      })
      window.google.accounts.id.prompt()
    } catch (error) {
      console.error('Google sign-in initialization error', error)
      setAuthMessage('Google sign-in failed to initialize. Please refresh and try again.')
    }
  }, [googleScriptLoaded, handleCredentialResponse])

  const scrollToSignIn = () => {
    signInSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page">
      <div className="glow" aria-hidden="true" />
      <header className="hero">
        <nav className="nav">
          <span className="nav__brand">Super Tutor</span>
          <div className="nav__actions">
            <button type="button" className="nav__link" onClick={scrollToSignIn}>
              Sign in
            </button>
          </div>
        </nav>
        <div className="hero__content">
          <p className="hero__eyebrow">AI mastery without limits</p>
          <h1 className="hero__title">
            Learn anything faster with the tutor who understands every subject on Earth.
          </h1>
          <p className="hero__subtitle">
            Super Tutor blends cutting-edge reasoning with a personal teaching style to keep you
            motivated, challenged, and mastering concepts at superhuman speed.
          </p>
          <div className="hero__actions">
            <button type="button" className="hero__cta" onClick={scrollToSignIn}>
              Start free with Google
            </button>
            <span className="hero__note">No credit card. Instant access.</span>
          </div>
          <dl className="hero__metrics">
            <div>
              <dt>4.9/5 rating</dt>
              <dd>From 50k+ student reviews worldwide</dd>
            </div>
            <div>
              <dt>10x faster</dt>
              <dd>Average improvement in concept mastery</dd>
            </div>
            <div>
              <dt>Every subject</dt>
              <dd>STEM, humanities, arts, languages &amp; more</dd>
            </div>
          </dl>
        </div>
      </header>

      <main>
        <section className="features" id="features">
          <h2>Why learners choose Super Tutor</h2>
          <div className="features__grid">
            <article>
              <h3>Adaptive teaching intelligence</h3>
              <p>
                Every explanation, quiz, and assignment adapts in real time to your knowledge gaps
                and preferred learning style.
              </p>
            </article>
            <article>
              <h3>Multi-modal mastery</h3>
              <p>
                Move seamlessly between text, diagrams, audio walk-throughs, and interactive coding
                sandboxes without leaving the lesson.
              </p>
            </article>
            <article>
              <h3>Always-on support</h3>
              <p>
                Schedule lightning-fast live sessions, async feedback, or late-night check-ins—Super
                Tutor never sleeps.
              </p>
            </article>
          </div>
        </section>

        <section className="testimonials" id="stories">
          <div className="testimonials__card">
            <p className="testimonials__quote">
              “I went from dreading calculus to loving it. Super Tutor explains every step and then
              challenges me to go further.”
            </p>
            <p className="testimonials__author">Jordan — Engineering Undergrad</p>
          </div>
          <div className="testimonials__card">
            <p className="testimonials__quote">
              “Within a week my conversational Spanish jumped to a whole new level. The personalized
              feedback is unreal.”
            </p>
            <p className="testimonials__author">Lucía — Lifelong Learner</p>
          </div>
        </section>

        <section className="auth" ref={signInSectionRef}>
          <div className="auth__content">
            <h2>Start learning in seconds</h2>
            <p>
              Sign in with Google to sync your progress across devices and unlock personalized
              lessons tailored to your goals.
            </p>
            <div className="auth__actions">
              <div ref={buttonRef} className="google-signin-button" />
              {userSignedIn && (
                <p className="auth__success">
                  Welcome back{userName ? `, ${userName}` : ''}! You’re signed in—launching your
                  next session now.
                </p>
              )}
              {authMessage && !userSignedIn && <p className="auth__message">{authMessage}</p>}
              {!GOOGLE_CLIENT_ID && !authMessage && (
                <p className="auth__message">
                  Provide a Google client ID in <code>VITE_GOOGLE_CLIENT_ID</code> to enable
                  one-click sign in.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Super Tutor. Mastery for every mind.</p>
      </footer>
    </div>
  )
}

export default App
