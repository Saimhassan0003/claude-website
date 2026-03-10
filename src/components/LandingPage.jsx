import styles from './LandingPage.module.css'
import Navbar from './Navbar'

const LandingPage = ({ onStartAssessment, onNav, onLogin }) => {
  return (
    <div className={styles.wrapper}>

      {/* Shared Navbar */}
      <Navbar
        isHR={false}
        screenInfo={{ screen: '1 OF 5', label: 'MAIN ENTRY · SURVEY.SEHATTI.COM' }}
        onHome={() => {}}
        onForCorporates={() => onStartAssessment('decision')}
        onGoReport={onNav?.onGoReport}
        onLogin={onLogin}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>GCC WORKPLACE WELLBEING INITIATIVE 2026</p>
        <h1 className={styles.heroTitle}>
          Measure Your <em className={styles.heroTitleItalic}>Workplace<br />Wellbeing</em> Today
        </h1>
        <p className={styles.heroSubtitle}>
          A free, confidential diagnostic designed for employees and HR<br />
          leaders across the GCC. Receive your personalized report in under<br />
          5 minutes.
        </p>

        {/* Path Cards */}
        <div className={styles.pathCards}>
          {/* Card 1 */}
          <div className={styles.pathCard}>
            <div className={styles.pathIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#c8973a" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#c8973a" strokeWidth="1.5"/>
              </svg>
            </div>
            <p className={styles.pathLabel}>PATH 01</p>
            <h2 className={styles.pathTitle}>Employee<br />Assessment</h2>
            <p className={styles.pathDesc}>
              Discover your personal wellbeing score<br />
              and understand the factors shaping your<br />
              performance and mental health at work.
            </p>
            <ul className={styles.pathFeatures}>
              <li>Burnout Risk Indicator (0–100)</li>
              <li>Stress Trigger Analysis</li>
              <li>Engagement Score</li>
              <li>AI Wellbeing Mini-Guide</li>
              <li>1:1 Coaching Draw Entry</li>
            </ul>
            <button
              className={styles.pathCta}
              onClick={() => onStartAssessment('employee')}
            >
              Begin Employee Survey
              <span className={styles.ctaArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#c8973a" strokeWidth="1.5"/>
                  <path d="M10 8l4 4-4 4" stroke="#c8973a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Card 2 - Decision Maker */}
          <div className={styles.pathCard}>
            <div className={styles.pathIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#c8973a" strokeWidth="1.5"/>
                <path d="M3 9h18" stroke="#c8973a" strokeWidth="1.5"/>
                <path d="M8 2v4M16 2v4" stroke="#c8973a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={styles.pathLabel}>PATH 02</p>
            <h2 className={styles.pathTitle}>Decision Maker<br />Assessment</h2>
            <p className={styles.pathDesc}>
              For CEOs, HR Leaders & Managers.<br />
              Evaluate your organization's wellbeing<br />
              readiness and buying signal.
            </p>
            <ul className={styles.pathFeatures}>
              <li>Organizational Wellbeing Gap Report</li>
              <li>Buying Readiness Signal (1–5)</li>
              <li>AI / Tech Adoption Readiness</li>
              <li>GCC Benchmark Comparison</li>
              <li>Free Pilot Program Eligibility</li>
            </ul>
            <button
              className={styles.pathCta}
              onClick={() => onStartAssessment('decision')}
            >
              Start Decision Maker Survey
              <span className={styles.ctaArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#c8973a" strokeWidth="1.5"/>
                  <path d="M10 8l4 4-4 4" stroke="#c8973a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>10–12</span>
          <span className={styles.statLabel}>Questions</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>&lt;5 min</span>
          <span className={styles.statLabel}>Completion Time</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Confidential</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>Free</span>
          <span className={styles.statLabel}>No Account Required</span>
        </div>
      </div>

      {/* Trust line */}
      <div className={styles.trustLine}>
        survey.sehatti.com · Secure · GCC-focused · Data never sold
      </div>

      {/* Bottom banner */}
      <div className={styles.bottomBanner}>
        EMPLOYEE ASSESSMENT FLOW → SURVEY.SEHATTI.COM/EMPLOYEE
      </div>
    </div>
  )
}

export default LandingPage
