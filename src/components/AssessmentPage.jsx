import React, { useState } from 'react'
import styles from './AssessmentPage.module.css'
import Navbar from './Navbar'

/* ─────────────────────────────────────────
   DECISION MAKER QUESTIONS  (17q)
───────────────────────────────────────── */
const decisionMakerQuestions = [
  // ── Section 1: Personal Information ──
  {
    id: 1, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'text', question: '1. Full Name',
    instruction: 'Please enter your full name.', options: [], required: true
  },
  {
    id: 2, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'text', question: '2. Email Address',
    instruction: 'Please enter your work email address.', options: [], required: true
  },
  {
    id: 3, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '3. Gender',
    instruction: 'Select your gender.',
    options: [
      { text: 'Female', score: 3 },
      { text: 'Male', score: 3 },
      { text: 'Prefer not to say', score: 3 }
    ],
    required: true
  },
  {
    id: 4, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '4. Job Title',
    instruction: 'Select your current role.',
    options: [
      { text: 'CEO / Founder', score: 5 },
      { text: 'HR Manager / Director', score: 4 },
      { text: 'People & Culture Lead', score: 4 },
      { text: 'General Manager / COO', score: 4 },
      { text: 'Department Manager', score: 3 },
      { text: 'Other', score: 3 }
    ],
    required: true
  },
  {
    id: 5, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '5. Company Size (total employees)',
    instruction: 'Select the option that best describes your organization.',
    options: [
      { text: '1–50 employees', score: 1 },
      { text: '51–200 employees', score: 2 },
      { text: '201–500 employees', score: 3 },
      { text: '501–2,000 employees', score: 4 },
      { text: '2,000+ employees', score: 5 }
    ],
    required: true
  },
  {
    id: 6, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '6. Industry',
    instruction: 'Select your primary industry.',
    options: [
      { text: 'Tech / IT', score: 3 },
      { text: 'Finance / Banking', score: 3 },
      { text: 'Healthcare', score: 3 },
      { text: 'Manufacturing / Industrial', score: 3 },
      { text: 'Retail / E-commerce', score: 3 },
      { text: 'Other', score: 3 }
    ],
    required: true
  },
  {
    id: 7, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '7. Years in Current Role',
    instruction: 'How long have you been in your current position?',
    options: [
      { text: 'Less than 1 year', score: 1 },
      { text: '1–3 years', score: 2 },
      { text: '3–5 years', score: 3 },
      { text: '5+ years', score: 5 }
    ],
    required: true
  },

  // ── Section 2: Problem & Current Practices ──
  {
    id: 8, category: 'Problem & Current Practices', section: 'Section 2 — Problem & Current Practices',
    type: 'radio', question: '8. How serious are employee wellbeing issues in your company right now?',
    instruction: 'Rate from 1 (Not an issue) to 5 (Critical issue).',
    options: [
      { text: '1 — Not an issue at all', score: 1 },
      { text: '2 — Minor concern', score: 2 },
      { text: '3 — Moderate concern', score: 3 },
      { text: '4 — Serious issue', score: 4 },
      { text: '5 — Critical issue', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 9, category: 'Problem & Current Practices', section: 'Section 2 — Problem & Current Practices',
    type: 'checkbox', question: '9. Select up to 3 current wellbeing challenges your company faces.',
    instruction: 'Choose the top challenges impacting your organization (max 3).',
    maxSelect: 3,
    options: [
      { text: 'High burnout rate', subtext: 'Employees stretched thin' },
      { text: 'Absenteeism', subtext: 'Frequent sick days or time off' },
      { text: 'Low employee engagement', subtext: 'Lack of motivation or connection' },
      { text: 'High turnover', subtext: 'Staff leaving the organization' },
      { text: 'Mental health complaints', subtext: 'Reported stress or anxiety' },
      { text: 'No major issues', subtext: 'Company is doing well overall' }
    ],
    required: false
  },
  {
    id: 10, category: 'Problem & Current Practices', section: 'Section 2 — Problem & Current Practices',
    type: 'radio', question: '10. What is the main current wellbeing solution used at your company?',
    instruction: 'Select your primary organizational wellbeing approach.',
    options: [
      { text: 'None', score: 1 },
      { text: 'EAP (Employee Assistance Program)', score: 3 },
      { text: 'Wellness Workshops / Events', score: 3 },
      { text: 'Digital Platform / App', score: 4 },
      { text: 'Insurance-based support', score: 3 },
      { text: 'Other', score: 2 }
    ],
    required: true
  },
  {
    id: 11, category: 'Problem & Current Practices', section: 'Section 2 — Problem & Current Practices',
    type: 'radio', question: '11. How satisfied are you with your current wellbeing solution?',
    instruction: 'Rate from 1 (Very dissatisfied) to 5 (Very satisfied).',
    options: [
      { text: '1 — Very dissatisfied', score: 1 },
      { text: '2 — Dissatisfied', score: 2 },
      { text: '3 — Neutral', score: 3 },
      { text: '4 — Satisfied', score: 4 },
      { text: '5 — Very satisfied', score: 5 }
    ],
    required: true, scoringQuestion: true
  },

  // ── Section 3: Solution Value & Buying ──
  {
    id: 12, category: 'Solution Value & Buying', section: 'Section 3 — Solution Value & Buying',
    type: 'radio', question: '12. Acceptable annual budget per employee for wellbeing software:',
    instruction: 'Select the closest budget range.',
    options: [
      { text: 'Less than $50', score: 1 },
      { text: '$50–$100', score: 2 },
      { text: '$100–$200', score: 3 },
      { text: '$200–$500', score: 4 },
      { text: 'More than $500', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 13, category: 'Solution Value & Buying', section: 'Section 3 — Solution Value & Buying',
    type: 'radio', question: '13. Expected decision timeline for implementing a new wellbeing solution:',
    instruction: 'When do you plan to take action?',
    options: [
      { text: '0–3 months', score: 5 },
      { text: '3–6 months', score: 4 },
      { text: '6–12 months', score: 3 },
      { text: 'Over 12 months', score: 2 },
      { text: 'No current plans', score: 1 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 14, category: 'Solution Value & Buying', section: 'Section 3 — Solution Value & Buying',
    type: 'radio', question: '14. Which ROI metric matters most to your organization?',
    instruction: 'Select the outcome that drives decision making.',
    options: [
      { text: 'Reduced employee turnover', score: 5 },
      { text: 'Reduced absenteeism', score: 5 },
      { text: 'Higher productivity', score: 5 },
      { text: 'Better engagement scores', score: 5 },
      { text: 'Improved employer branding', score: 5 }
    ],
    required: true
  },
  {
    id: 15, category: 'Solution Value & Buying', section: 'Section 3 — Solution Value & Buying',
    type: 'radio', question: '15. Would you approve a paid pilot if ROI is measurable within 6 months?',
    instruction: 'Select your preference.',
    options: [
      { text: 'Yes — ready to move forward', score: 5 },
      { text: 'Maybe — need more information', score: 3 },
      { text: 'No — not at this time', score: 1 }
    ],
    required: true, scoringQuestion: true
  },

  // ── Section 4: AI / Tech Readiness ──
  {
    id: 16, category: 'AI / Tech Readiness', section: 'Section 4 — AI / Tech Readiness',
    type: 'radio', question: '16. What would be the most important feature in a wellness platform dashboard?',
    instruction: 'Select the key capability for your decision.',
    options: [
      { text: 'Real-time stress insights and alerts', score: 5 },
      { text: 'Productivity / ROI analytics', score: 5 },
      { text: 'Team performance overview', score: 5 },
      { text: 'Integration with wearables and tools', score: 5 },
      { text: 'Other', score: 3 }
    ],
    required: true
  },
  {
    id: 17, category: 'AI / Tech Readiness', section: 'Section 4 — AI / Tech Readiness',
    type: 'radio', question: '17. How confident are you in your team\'s ability to adopt an AI-powered wellbeing dashboard?',
    instruction: 'Rate from 1 (Not confident) to 5 (Extremely confident).',
    options: [
      { text: '1 — Not confident at all', score: 1 },
      { text: '2 — Slightly confident', score: 2 },
      { text: '3 — Moderately confident', score: 3 },
      { text: '4 — Quite confident', score: 4 },
      { text: '5 — Extremely confident', score: 5 }
    ],
    required: true, scoringQuestion: true
  }
]

/* ─────────────────────────────────────────
   EMPLOYEE QUESTIONS  (17q)
───────────────────────────────────────── */
const employeeQuestions = [
  // ── Section 1: Personal Information ──
  {
    id: 1, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'text', question: '1. Full Name',
    instruction: 'Please enter your full name.', options: [], required: true
  },
  {
    id: 2, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'text', question: '2. Email Address',
    instruction: 'Please enter your email address.', options: [], required: true
  },
  {
    id: 3, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '3. Gender',
    instruction: 'Select your gender.',
    options: [
      { text: 'Female', score: 3 },
      { text: 'Male', score: 3 },
      { text: 'Prefer not to say', score: 3 }
    ],
    required: true
  },
  {
    id: 4, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '4. Job Role Type',
    instruction: 'Select your current role type.',
    options: [
      { text: 'Individual contributor', score: 2 },
      { text: 'Team lead / Supervisor', score: 3 },
      { text: 'Manager', score: 4 },
      { text: 'Executive', score: 5 }
    ],
    required: true
  },
  {
    id: 5, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '5. Years in Current Role',
    instruction: 'How long have you been in your current position?',
    options: [
      { text: 'Less than 1 year', score: 2 },
      { text: '1–3 years', score: 3 },
      { text: '3–5 years', score: 4 },
      { text: '5+ years', score: 5 }
    ],
    required: true
  },
  {
    id: 6, category: 'Personal Information', section: 'Section 1 — Personal Information',
    type: 'radio', question: '6. Work Hours Per Week (average)',
    instruction: 'Select your average weekly working hours.',
    options: [
      { text: 'Under 35 hours', score: 2 },
      { text: '35–45 hours', score: 3 },
      { text: '45–55 hours', score: 4 },
      { text: '55+ hours', score: 5 }
    ],
    required: true
  },

  // ── Section 2: Stress & Current Support ──
  {
    id: 7, category: 'Stress & Current Support', section: 'Section 2 — Stress & Current Support',
    type: 'radio', question: '7. How often do you experience work-related stress?',
    instruction: 'Rate from 1 (Rarely) to 5 (Daily).',
    options: [
      { text: '1 — Rarely', score: 1 },
      { text: '2 — Monthly', score: 2 },
      { text: '3 — Weekly', score: 3 },
      { text: '4 — Several times per week', score: 4 },
      { text: '5 — Daily', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 8, category: 'Stress & Current Support', section: 'Section 2 — Stress & Current Support',
    type: 'radio', question: '8. How severe are your stress symptoms (fatigue, anxiety, etc.)?',
    instruction: 'Rate from 1 (Manageable) to 5 (Overwhelming).',
    options: [
      { text: '1 — Manageable / barely noticeable', score: 1 },
      { text: '2 — Mild impact on daily life', score: 2 },
      { text: '3 — Moderate impact', score: 3 },
      { text: '4 — Significant impact', score: 4 },
      { text: '5 — Overwhelming / severe', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 9, category: 'Stress & Current Support', section: 'Section 2 — Stress & Current Support',
    type: 'radio', question: '9. How comfortable are you discussing wellbeing issues at work?',
    instruction: 'Rate from 1 (Not comfortable) to 5 (Very comfortable).',
    options: [
      { text: '1 — Not comfortable at all', score: 1 },
      { text: '2 — Slightly uncomfortable', score: 2 },
      { text: '3 — Neutral', score: 3 },
      { text: '4 — Comfortable', score: 4 },
      { text: '5 — Very comfortable', score: 5 }
    ],
    required: true
  },
  {
    id: 10, category: 'Stress & Current Support', section: 'Section 2 — Stress & Current Support',
    type: 'checkbox', question: '10. Where do you currently seek stress support?',
    instruction: 'Select up to 2 primary sources of support.',
    maxSelect: 2,
    options: [
      { text: 'Friends / family', subtext: 'Personal network' },
      { text: 'Manager', subtext: 'Workplace superior' },
      { text: 'Apps / online resources', subtext: 'Digital platforms' },
      { text: 'Therapist / professional', subtext: 'Professional medical support' },
      { text: 'No one', subtext: 'I prefer to manage it myself' }
    ],
    required: false
  },

  // ── Section 3: Tool Interest ──
  {
    id: 11, category: 'Tool Interest', section: 'Section 3 — Tool Interest',
    type: 'radio', question: '11. Have you needed mental health support in the past year?',
    instruction: 'Select Yes or No.',
    options: [
      { text: 'Yes', score: 5 },
      { text: 'No', score: 1 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 12, category: 'Tool Interest', section: 'Section 3 — Tool Interest',
    type: 'radio', question: '12. How likely are you to use a wearable-based stress insights tool?',
    instruction: 'Rate from 1 (Not likely) to 5 (Very likely).',
    options: [
      { text: '1 — Not likely at all', score: 1 },
      { text: '2 — Slightly likely', score: 2 },
      { text: '3 — Somewhat likely', score: 3 },
      { text: '4 — Likely', score: 4 },
      { text: '5 — Very likely', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 13, category: 'Tool Interest', section: 'Section 3 — Tool Interest',
    type: 'radio', question: '13. Expected usage frequency if provided by your employer:',
    instruction: 'How often would you use the tool?',
    options: [
      { text: 'Never', score: 1 },
      { text: 'Occasionally', score: 2 },
      { text: 'Monthly', score: 3 },
      { text: 'Weekly', score: 4 },
      { text: 'Multiple times per week', score: 5 }
    ],
    required: true, scoringQuestion: true
  },
  {
    id: 14, category: 'Tool Interest', section: 'Section 3 — Tool Interest',
    type: 'checkbox', question: '14. Top barriers to using such a tool:',
    instruction: 'Select up to 2 main concerns.',
    maxSelect: 2,
    options: [
      { text: 'Privacy concerns', subtext: 'Worries about data sharing' },
      { text: 'Time constraints', subtext: 'Too busy to engage' },
      { text: 'Lack of trust', subtext: 'Skeptical of the technology' },
      { text: 'No interest', subtext: 'Do not see the value' },
      { text: 'No barriers', subtext: 'Fully ready to adopt' }
    ],
    required: false
  },

  // ── Section 4: Platform Usage ──
  {
    id: 15, category: 'Platform Usage', section: 'Section 4 — Platform Usage',
    type: 'checkbox', question: '15. How would you prefer to share wellbeing insights with your manager?',
    instruction: 'Select up to 2 preferred sharing methods.',
    maxSelect: 2,
    options: [
      { text: 'Anonymized team trends only', subtext: 'Aggregate data, no personal details' },
      { text: 'Selective personal summaries', subtext: 'e.g., "green/yellow/red" status' },
      { text: 'Detailed stress pattern reports', subtext: 'Full transparency' },
      { text: 'No sharing — full privacy', subtext: 'I want complete privacy' },
      { text: 'Manager-requested check-ins only', subtext: 'Only when asked by leadership' }
    ],
    required: false
  },
  {
    id: 16, category: 'Platform Usage', section: 'Section 4 — Platform Usage',
    type: 'radio', question: '16. What notification style would work best for stress alerts?',
    instruction: 'Select your preferred alert format.',
    options: [
      { text: 'Push notifications on mobile', score: 5 },
      { text: 'In-dashboard banners only', score: 4 },
      { text: 'Email summaries', score: 3 },
      { text: 'SMS / text alerts', score: 2 },
      { text: 'No notifications — I\'ll check manually', score: 1 }
    ],
    required: true
  },
  {
    id: 17, category: 'Platform Usage', section: 'Section 4 — Platform Usage',
    type: 'checkbox', question: '17. What would be the most important feature in a wellness dashboard?',
    instruction: 'Select up to 2 key capabilities.',
    maxSelect: 2,
    options: [
      { text: 'Growth & behavior overview', subtext: 'Tracking personal progress over time' },
      { text: 'Learning & development hub', subtext: 'Educational resources and courses' },
      { text: 'Community support', subtext: 'Connecting with peers' },
      { text: 'Wellness report', subtext: 'Lifestyle change and behavior metrics' },
      { text: 'Employee assistance program', subtext: 'Direct access to professional help' }
    ],
    required: false
  }
]

/* ─────────────────────────────────────────
   SECTION HEADER MAP
───────────────────────────────────────── */
const getSectionBoundaries = (questions) => {
  const seen = new Set()
  const map = {}
  questions.forEach((q, i) => {
    if (!seen.has(q.section)) {
      seen.add(q.section)
      map[i] = q.section
    }
  })
  return map
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const AssessmentPage = ({ type, onBack, onComplete, onForCorporates, onGoReport, onLogin }) => {
  const isDecision = type === 'decision' || type === 'hr'
  const questions = isDecision ? decisionMakerQuestions : employeeQuestions
  const totalQ = questions.length
  const sectionBoundaries = getSectionBoundaries(questions)

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [validationError, setValidationError] = useState('')

  const q = questions[currentQ]
  const isCheckbox = q.type === 'checkbox'

  /* ── Handlers ── */
  const handleRadioSelect = (optionIdx) => {
    setAnswers(prev => ({ ...prev, [q.id]: optionIdx }))
    setValidationError('')
  }

  const handleCheckboxToggle = (optionIdx) => {
    const current = Array.isArray(answers[q.id]) ? answers[q.id] : []
    const exists = current.includes(optionIdx)
    const maxSelect = q.maxSelect || Infinity
    if (!exists && current.length >= maxSelect) {
      setValidationError(`You can select at most ${maxSelect} option${maxSelect > 1 ? 's' : ''}.`)
      return
    }
    setAnswers(prev => ({
      ...prev,
      [q.id]: exists ? current.filter(i => i !== optionIdx) : [...current, optionIdx]
    }))
    setValidationError('')
  }

  const handleTextChange = (e) => {
    const isName = q.id === 1
    let val = e.target.value
    // Name: strip any digits as user types
    if (isName) val = val.replace(/[0-9]/g, '')
    setAnswers(prev => ({ ...prev, [q.id]: val }))
    setValidationError('')
  }

  /* ── Validation ── */
  const validateCurrent = () => {
    if (!q.required) return true
    const val = answers[q.id]
    
    if (q.type === 'text') {
      const isName = q.id === 1
      const isEmail = q.id === 2
      if (!val || String(val).trim() === '') {
        setValidationError(
          isName ? 'Please enter your full name (letters only).'
          : isEmail ? 'Please enter your email address.'
          : 'This field is required.'
        )
        return false
      }
      if (isName && /[0-9]/.test(val)) {
        setValidationError('Name must contain letters only — no numbers allowed.')
        return false
      }
      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (!emailRegex.test(String(val).trim())) {
          setValidationError('Please enter a valid email address (e.g. name@company.com).')
          return false
        }
      }
    } else if (q.type === 'radio') {
      if (val === undefined || val === null) {
        setValidationError('Please select an option before continuing.')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrent()) return
    if (currentQ < totalQ - 1) setCurrentQ(prev => prev + 1)
    else onComplete(answers, questions)
  }

  const handlePrev = () => {
    setValidationError('')
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }

  const handleSkip = () => {
    if (!validateCurrent()) return
    setValidationError('')
    if (currentQ < totalQ - 1) setCurrentQ(prev => prev + 1)
    else onComplete(answers, questions)
  }

  const handleQuestionJump = (idx) => {
    setValidationError('')
    setCurrentQ(idx)
  }

  /* ── Derived values ── */
  const selectedRadio = q.type === 'radio' ? answers[q.id] : undefined
  const selectedCheckboxes = q.type === 'checkbox' && Array.isArray(answers[q.id]) ? answers[q.id] : []
  const textValue = q.type === 'text' ? (answers[q.id] || '') : ''
  const progressPct = Math.round(((currentQ) / totalQ) * 100)

  const pathLabel = isDecision ? 'DECISION MAKER PATH' : 'EMPLOYEE PATH'
  const assessmentTitle = isDecision ? 'Decision Maker Assessment' : 'Employee Wellbeing Assessment'
  const bottomBanner = isDecision
    ? 'DECISION MAKER SURVEY → SURVEY.SEHATTI.COM/DM'
    : 'EMPLOYEE ASSESSMENT FLOW → SURVEY.SEHATTI.COM/EMPLOYEE'

  return (
    <div className={`${styles.wrapper} ${isDecision ? styles.wrapperHR : ''}`}>

      <Navbar
        isHR={isDecision}
        screenInfo={{
          screen: isDecision ? '3 OF 5' : '2 OF 5',
          label: isDecision ? 'DECISION MAKER · /DM' : 'EMPLOYEE ASSESSMENT · /EMPLOYEE',
          title: assessmentTitle,
          status: 'In Progress'
        }}
        onHome={onBack}
        onForCorporates={onForCorporates || (() => {})}
        onGoReport={onGoReport}
        onLogin={onLogin}
      />

      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isDecision ? styles.sidebarHR : ''}`}>
          <p className={`${styles.sidebarPath} ${isDecision ? styles.sidebarPathHR : ''}`}>{pathLabel}</p>
          <h2 className={styles.sidebarTitle}>{assessmentTitle}</h2>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={`${styles.progressLabel} ${isDecision ? styles.progressLabelHR : ''}`}>Progress</span>
              <span className={styles.progressCount}>{progressPct}% Complete</span>
            </div>
            <div className={styles.progressBarOuter}>
              <div
                className={`${styles.progressBarInner} ${isDecision ? styles.progressBarInnerHR : ''}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className={styles.progressCount} style={{ marginTop: '4px', display: 'block' }}>
              Question {currentQ + 1} of {totalQ}
            </span>
          </div>

          <ul className={styles.questionList}>
            {questions.map((qq, idx) => {
              const isAnswered = answers[qq.id] !== undefined &&
                (Array.isArray(answers[qq.id]) ? answers[qq.id].length > 0 : String(answers[qq.id]).trim() !== '')
              const isCurrent = idx === currentQ
              const isPast = idx < currentQ
              const showSection = sectionBoundaries[idx]
              return (
                <React.Fragment key={qq.id}>
                  {showSection && (
                    <li className={styles.sectionHeader}>{showSection}</li>
                  )}
                  <li
                    className={[
                      styles.questionListItem,
                      isCurrent ? (isDecision ? styles.questionListItemActiveHR : styles.questionListItemActive) : '',
                      isPast ? styles.questionListItemDone : '',
                    ].join(' ')}
                    onClick={() => handleQuestionJump(idx)}
                  >
                    <span className={`${styles.questionNumber} ${isCurrent && isDecision ? styles.questionNumberHR : ''}`}>
                      {isAnswered
                        ? <span className={`${styles.checkIcon} ${isDecision ? styles.checkIconHR : ''}`}>✓</span>
                        : <span className={styles.qNumber}>{qq.id}</span>}
                    </span>
                    <span className={`${styles.questionCat} ${isCurrent ? styles.questionCatActive : ''}`}>
                      {qq.category}
                    </span>
                  </li>
                </React.Fragment>
              )
            })}
          </ul>

          <p className={styles.sidebarPrivacy}>
            {isDecision
              ? 'Decision Maker data is stored separately. Results feed into the GCC HR Wellbeing Readiness Report 2026.'
              : 'Your responses are anonymous and encrypted. Data is used only for your personal report.'}
          </p>
        </aside>

        {/* Main content */}
        <main className={styles.mainContent}>
          {/* Section label */}
          <p className={`${styles.questionEyebrow} ${isDecision ? styles.questionEyebrowHR : ''}`}>
            {q.section.toUpperCase()} · QUESTION {currentQ + 1} OF {totalQ}
          </p>
          <h2 className={styles.questionText}>{q.question}</h2>
          <p className={`${styles.questionInstruction} ${isCheckbox ? (isDecision ? styles.questionInstructionCheckboxHR : styles.questionInstructionCheckbox) : ''}`}>
            {q.instruction}
            {q.maxSelect && <span style={{ color: isDecision ? '#4caf7d' : '#c8973a', fontWeight: 600 }}> (max {q.maxSelect})</span>}
          </p>

          {/* TEXT INPUT */}
          {q.type === 'text' && (
            <div className={styles.textInputWrap}>
              <input
                type={q.question.toLowerCase().includes('email') ? 'email' : 'text'}
                className={`${styles.textInput} ${isDecision ? styles.textInputHR : ''}`}
                placeholder={`Enter your ${q.question.toLowerCase().includes('email') ? 'email' : 'full name'}...`}
                value={textValue}
                onChange={handleTextChange}
              />
            </div>
          )}

          {/* RADIO OPTIONS */}
          {q.type === 'radio' && (
            <div className={styles.optionsList}>
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`option-${currentQ}-${idx}`}
                  className={[
                    styles.optionItem,
                    selectedRadio === idx ? (isDecision ? styles.optionItemSelectedHR : styles.optionItemSelected) : '',
                    isDecision ? styles.optionItemHR : '',
                  ].join(' ')}
                  onClick={() => handleRadioSelect(idx)}
                >
                  <span className={styles.optionRadio}>
                    {selectedRadio === idx
                      ? <span className={`${styles.radioFilled} ${isDecision ? styles.radioFilledHR : ''}`} />
                      : <span className={styles.radioEmpty} />}
                  </span>
                  <span className={styles.optionText}>{opt.text}</span>
                  {opt.score && <span className={styles.optionScore}>Score: {opt.score}</span>}
                </button>
              ))}
            </div>
          )}

          {/* CHECKBOX OPTIONS */}
          {isCheckbox && (
            <div className={styles.checkboxGrid}>
              {q.options.map((opt, idx) => {
                const checked = selectedCheckboxes.includes(idx)
                const maxReached = q.maxSelect && selectedCheckboxes.length >= q.maxSelect && !checked
                return (
                  <button
                    key={idx}
                    id={`cb-option-${currentQ}-${idx}`}
                    className={[
                      styles.checkboxCard,
                      checked ? styles.checkboxCardSelected : '',
                      maxReached ? styles.checkboxCardDisabled : '',
                    ].join(' ')}
                    onClick={() => handleCheckboxToggle(idx)}
                  >
                    <span className={`${styles.checkboxBox} ${checked ? styles.checkboxBoxChecked : ''}`}>
                      {checked && <span className={styles.checkboxTick}>✓</span>}
                    </span>
                    <div className={styles.checkboxCardBody}>
                      <span className={`${styles.checkboxCardTitle} ${checked ? styles.checkboxCardTitleSelected : ''}`}>
                        {opt.text}
                      </span>
                      {opt.subtext && (
                        <span className={styles.checkboxCardSub}>{opt.subtext}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div className={styles.validationError}>
              ⚠ {validationError}
            </div>
          )}

          {/* Nav buttons */}
          <div className={styles.navButtons}>
            <button
              className={styles.prevBtn}
              onClick={handlePrev}
              disabled={currentQ === 0}
            >
              ← Previous
            </button>
            <button
              id="next-question-btn"
              className={`${styles.nextBtn} ${isDecision ? styles.nextBtnHR : ''}`}
              onClick={handleNext}
            >
              {currentQ === totalQ - 1 ? 'Submit Survey →' : 'Next Question →'}
            </button>
            {!q.required && (
              <button className={styles.skipBtn} onClick={handleSkip}>Skip</button>
            )}
          </div>
        </main>
      </div>

      <div className={`${styles.bottomBanner} ${isDecision ? styles.bottomBannerHR : ''}`}>
        {bottomBanner}
      </div>
    </div>
  )
}

export default AssessmentPage
