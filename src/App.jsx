import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AssessmentPage from './components/AssessmentPage'
import SurveyResultsPage from './components/SurveyResultsPage'
import AuthPage from './components/AuthPage'
import TopBanner from './components/TopBanner'
import NotificationBar from './components/NotificationBar'
import './App.css'

/* ─────────────────────────────────────────
   SCORING ENGINE  (1–5 average scale)
───────────────────────────────────────── */

// Decision Maker: Q8, Q11, Q12, Q13, Q15, Q17
const DM_SCORING_IDS = [8, 11, 12, 13, 15, 17]

// Employee: Q7, Q8, Q11, Q12, Q13
const EMP_SCORING_IDS = [7, 8, 11, 12, 13]

const calcScore = (answers, questions, scoringIds) => {
  let total = 0
  let count = 0
  scoringIds.forEach(qId => {
    const q = questions.find(qq => qq.id === qId)
    if (!q) return
    const ans = answers[qId]
    if (ans === undefined || ans === null) return
    if (q.type === 'radio' && q.options[ans]) {
      total += q.options[ans].score || 0
      count++
    }
  })
  return count > 0 ? Math.round((total / count) * 10) / 10 : null
}

/* Extract individual scoring question raw scores (1–5) for sub-reports */
const extractScoredValues = (answers, questions, ids) => {
  const result = {}
  ids.forEach(qId => {
    const q = questions.find(qq => qq.id === qId)
    if (!q) return
    const ans = answers[qId]
    if (ans === undefined || ans === null) return
    if (q.type === 'radio' && q.options[ans]) {
      result[`q${qId}`] = q.options[ans].score
    }
  })
  return result
}

/* ─────────────────────────────────────────
   LOCAL STORAGE HELPERS
───────────────────────────────────────── */
const KEYS = { decision: 'sehatti_decision', employee: 'sehatti_employee' }
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

const saveResult = (type, payload) => {
  try {
    const key = type === 'decision' ? KEYS.decision : KEYS.employee
    
    // Create a sanitized copy to prevent storing plaintext PII (Name = Q1, Email = Q2)
    const sanitizedAnswers = { ...payload.answers }
    delete sanitizedAnswers[1] // Name
    delete sanitizedAnswers[2] // Email

    const safePayload = { ...payload, answers: sanitizedAnswers }
    localStorage.setItem(key, JSON.stringify({ ...safePayload, savedAt: new Date().getTime() }))
  } catch (_) {}
}

const loadResult = (type) => {
  try {
    const key = type === 'decision' ? KEYS.decision : KEYS.employee
    const raw = localStorage.getItem(key)
    if (!raw) return null
    
    const data = JSON.parse(raw)
    const now = new Date().getTime()
    
    // Expire old data
    if (!data.savedAt || now - data.savedAt > TTL_MS) {
      localStorage.removeItem(key)
      return null
    }

    // Clamp score fields to prevent DevTools injection attacks (0-5 range)
    if (data.decisionScore != null) data.decisionScore = Math.max(0, Math.min(5, Number(data.decisionScore)))
    if (data.employeeScore != null) data.employeeScore = Math.max(0, Math.min(5, Number(data.employeeScore)))

    return data
  } catch (_) { return null }
}

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [assessmentType, setAssessmentType] = useState(null)  // 'decision' | 'employee'

  /* ── Navigation ── */
  const goHome = () => { setCurrentScreen('landing'); setAssessmentType(null) }
  const goAuth = () => setCurrentScreen('auth')
  const startDecision = () => { setAssessmentType('decision'); setCurrentScreen('assessment') }

  const handleStartAssessment = (type) => {
    // Normalize: 'hr' maps to 'decision' for backward compat
    const normalized = (type === 'hr') ? 'decision' : type
    setAssessmentType(normalized)
    setCurrentScreen('assessment')
  }

  const handleAssessmentComplete = (answers, questions) => {
    const isDecision = assessmentType === 'decision' || assessmentType === 'hr'
    const scoringIds = isDecision ? DM_SCORING_IDS : EMP_SCORING_IDS
    const score = calcScore(answers, questions, scoringIds)
    const scored = extractScoredValues(answers, questions, scoringIds)

    const payload = {
      answers,
      score,
      scored,          // { q8: 4, q11: 3, ... } for sub-metric display
      type: isDecision ? 'decision' : 'employee',
      ...(isDecision ? { decisionScore: score } : { employeeScore: score }),
      ...scored
    }

    saveResult(isDecision ? 'decision' : 'employee', payload)
    setCurrentScreen('results')
  }

  /* ── Read both surveys from storage for results page ── */
  const decisionData = loadResult('decision')
  const employeeData = loadResult('employee')

  return (
    <div className="app">
      <NotificationBar views={22} />
      <TopBanner isHR={currentScreen !== 'landing' && (assessmentType === 'decision' || assessmentType === 'hr')} />

      {currentScreen === 'landing' && (
        <LandingPage
          onStartAssessment={handleStartAssessment}
          onNav={{ onGoReport: () => setCurrentScreen('results') }}
          onLogin={goAuth}
        />
      )}

      {currentScreen === 'auth' && (
        <AuthPage
          onBack={goHome}
          onForCorporates={startDecision}
          onAuthSuccess={goHome}
          onLogin={goAuth}
        />
      )}

      {currentScreen === 'assessment' && (
        <AssessmentPage
          type={assessmentType}
          onBack={goHome}
          onComplete={handleAssessmentComplete}
          onForCorporates={startDecision}
          onGoReport={() => setCurrentScreen('results')}
          onLogin={goAuth}
        />
      )}

      {currentScreen === 'results' && (
        <SurveyResultsPage
          type={assessmentType}
          decisionData={decisionData}
          employeeData={employeeData}
          onBack={goHome}
          onRetake={goHome}
          onForCorporates={startDecision}
          onLogin={goAuth}
        />
      )}
    </div>
  )
}

export default App
