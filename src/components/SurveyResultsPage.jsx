import styles from './SurveyResultsPage.module.css'
import Navbar from './Navbar'
import html2pdf from 'html2pdf.js'

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const escapeHtml = (unsafe) => {
  if (unsafe == null) return ''
  return String(unsafe).replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#039;'
      default: return m
    }
  })
}
const toHundred = (score) => score != null ? Math.round(score * 20) : null
const fmt1 = (n) => (typeof n === 'number' ? n.toFixed(1) : '—')
const now = new Date()
const MONTH_YEAR = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase()

/* ── Circular Gauge SVG ── */
const CircleGauge = ({ score, color, bg = 'rgba(255,255,255,0.07)' }) => {
  const R = 64
  const circ = 2 * Math.PI * R
  const offset = circ - (score / 100) * circ
  return (
    <div className={styles.gaugeCircleWrap}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={R} fill="none" stroke={bg} strokeWidth="10" />
        <circle
          cx="80" cy="80" r={R} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="80" y="76" textAnchor="middle" fill="#fff" fontSize="30"
          fontFamily="'Playfair Display', Georgia, serif" fontWeight="400">{score}</text>
        <text x="80" y="96" textAnchor="middle" fill="rgba(255,255,255,0.4)"
          fontSize="12" fontFamily="'Inter', sans-serif">/100</text>
      </svg>
    </div>
  )
}

/* ── Horizontal Bar ── */
const HBar = ({ label, value, max = 100, color, benchmarkValue }) => (
  <div className={styles.hBarRow}>
    <span className={styles.hBarLabel}>{label}</span>
    <div className={styles.hBarTrackWrap}>
      <div className={styles.hBarTrack}>
        <div className={styles.hBarFill} style={{ width: `${value}%`, backgroundColor: color }} />
        {benchmarkValue && (
          <div className={styles.hBarBenchmark} style={{ left: `${benchmarkValue}%` }} />
        )}
      </div>
    </div>
    <span className={styles.hBarValue} style={{ color }}>{value}%</span>
  </div>
)

/* ── Dimension Score Card ── */
const DimCard = ({ label, score, color }) => (
  <div className={styles.dimCard}>
    <span className={styles.dimLabel}>{label}</span>
    <div className={styles.dimBar}>
      <div className={styles.dimBarFill} style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
    <span className={styles.dimScore} style={{ color }}>{score} / 100</span>
  </div>
)

/* ── Stat Row (sidebar) ── */
const StatRow = ({ label, value, valueColor }) => (
  <div className={styles.statRow}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue} style={{ color: valueColor || '#fff' }}>{value}</span>
  </div>
)

/* ─────────────────────────────────────────
   DECISION MAKER REPORT SECTION
───────────────────────────────────────── */
const DMReport = ({ data, onDownloadPDF }) => {
  const score = toHundred(data.decisionScore)
  const dm = data

  /* Readiness tier */
  const tier = score >= 80 ? { label: 'High Readiness', badge: 'TOP-TIER GCC BENCHMARK', color: '#4caf7d' }
    : score >= 60 ? { label: 'Developing Readiness', badge: 'MID-TIER GCC BENCHMARK', color: '#4caf7d' }
    : score >= 40 ? { label: 'Moderate Readiness', badge: 'DEVELOPING BENCHMARK', color: '#c8973a' }
    : { label: 'Low Readiness', badge: 'BELOW GCC BENCHMARK', color: '#e05c5c' }

  const percentile = score >= 80 ? '72nd' : score >= 60 ? '45th' : score >= 40 ? '28th' : '14th'
  const pilotEligible = score < 75
  const crmStatus = score >= 70 ? 'Hot Lead · Active' : score >= 50 ? 'Warm Lead · Tagged' : 'Cold Lead · Nurture'

  /* Gap bars — derived from scoring questions */
  const gaps = [
    { label: 'Mental Health Programs', value: dm.q8 != null ? Math.round(dm.q8 * 20) : 40, bench: 72 },
    { label: 'Burnout Prevention Policy', value: dm.q11 != null ? Math.round(dm.q11 * 20) : 50, bench: 68 },
    { label: 'Wellbeing Budget Allocation', value: dm.q12 != null ? Math.round(dm.q12 * 20) : 40, bench: 65 },
    { label: 'Data & Measurement', value: dm.q17 != null ? Math.round(dm.q17 * 20) : 25, bench: 60 },
    { label: 'Leadership Wellbeing Training', value: dm.q13 != null ? Math.round(dm.q13 * 20) : 65, bench: 70 },
  ]
  const critical = [...gaps].sort((a, b) => a.value - b.value)[0]
  const strongest = [...gaps].sort((a, b) => b.value - a.value)[0]

  return (
    <div className={styles.dmReport}>
      {/* ── Header ── */}
      <div className={styles.reportHeader}>
        <div className={styles.reportHeaderLeft}>
          <p className={styles.reportEyebrow} style={{ color: '#4caf7d' }}>
            ORGANIZATIONAL WELLBEING REPORT · {MONTH_YEAR}
          </p>
          <h1 className={styles.reportHeroTitle}>
            Organizational Readiness Score: <span style={{ color: '#4caf7d' }}>{score}</span>
          </h1>
          <p className={styles.reportSubline}>GCC Workplace · Decision Maker Assessment</p>
        </div>
      </div>

      {/* ── Body: 2-col ── */}
      <div className={styles.reportBody}>
        {/* LEFT: gauge + gap bars */}
        <div className={styles.reportMain}>

          {/* Score card */}
          <div className={styles.scoreCard} style={{ borderColor: 'rgba(76,175,125,0.2)' }}>
            <CircleGauge score={score} color="#4caf7d" />
            <div className={styles.scoreCardMeta}>
              <h2 className={styles.tierTitle} style={{ color: '#4caf7d' }}>{tier.label}</h2>
              <span className={styles.tierBadge} style={{ borderColor: 'rgba(76,175,125,0.35)', color: '#4caf7d' }}>
                {tier.badge}
              </span>
              <p className={styles.tierDesc}>
                {score >= 70
                  ? 'Your organization demonstrates strong wellbeing foundations with clear strategic vision. You are positioned in the upper tier among GCC organizations.'
                  : score >= 50
                  ? 'Your organization has foundational wellbeing elements in place but significant strategic gaps remain. You are positioned in the mid-tier among GCC organizations.'
                  : 'Your organization shows early-stage wellbeing development. Immediate investment in core programs and measurement is recommended.'}
              </p>
            </div>
          </div>

          {/* Gap analysis */}
          <div className={styles.gapSection}>
            <p className={styles.gapTitle}>WELLBEING GAP ANALYSIS VS GCC BENCHMARK</p>
            {gaps.map(g => (
              <HBar key={g.label} label={g.label} value={g.value} color="#4caf7d" benchmarkValue={g.bench} />
            ))}
            <div className={styles.barLegend}>
              <span><span className={styles.legendDot} style={{ background: '#4caf7d' }} /> Your score</span>
              <span><span className={styles.legendDot} style={{ background: 'rgba(255,255,255,0.3)' }} /> GCC Benchmark</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.reportActions}>
            <button className={styles.actionPrimary} style={{ background: '#4caf7d', color: '#071208' }}
              onClick={onDownloadPDF}>
              📄 Download Full Report (PDF)
            </button>
            <button className={styles.actionOutline} style={{ borderColor: 'rgba(76,175,125,0.4)', color: '#4caf7d' }}>
              Book Strategy Consultation
            </button>
            <button className={styles.actionOutline} style={{ borderColor: 'rgba(76,175,125,0.2)', color: '#8a9bb0' }}>
              Explore Pilot Program
            </button>
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div className={styles.reportSidebar}>
          <div className={styles.sidebarBox} style={{ borderColor: 'rgba(76,175,125,0.15)' }}>
            <p className={styles.sidebarBoxTitle} style={{ color: '#4caf7d' }}>ORGANIZATIONAL SUMMARY</p>
            <StatRow label="READINESS SCORE" value={`${score} / 100`} valueColor="#fff" />
            <StatRow label="GCC SECTOR PERCENTILE" value={`${percentile} percentile`} valueColor="#fff" />
            <StatRow label="CRITICAL GAP" value={`${critical.label} (${critical.value}%)`} valueColor="#e05c5c" />
            <StatRow label="STRONGEST AREA" value={`${strongest.label} (${strongest.value}%)`} valueColor="#4caf7d" />
            <StatRow label="PILOT ELIGIBILITY"
              value={pilotEligible ? 'Eligible — Recommended' : 'Advanced Track'}
              valueColor="#4caf7d" />
            <StatRow label="CRM STATUS" value={crmStatus} valueColor="#c8973a" />
          </div>

          {/* Pilot offer */}
          {pilotEligible && (
            <div className={styles.pilotCard} style={{ borderColor: 'rgba(76,175,125,0.2)' }}>
              <h3 className={styles.pilotTitle}>Free Pilot Offer</h3>
              <p className={styles.pilotDesc}>
                Your organization qualifies for a 30-day SEHATTI pilot program. A dedicated wellbeing strategist will reach out within 48 hours.
              </p>
              <button className={styles.pilotBtn} style={{ background: '#4caf7d', color: '#071208' }}>
                Confirm Pilot Interest →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   EMPLOYEE REPORT SECTION
───────────────────────────────────────── */
const EmpReport = ({ data, onDownloadPDF }) => {
  const score = toHundred(data.employeeScore)
  const emp = data

  const tier = score >= 80 ? { label: 'Strong Wellbeing', badge: 'GREEN ZONE', color: '#4caf7d' }
    : score >= 60 ? { label: 'Moderate Wellbeing', badge: 'CAUTION ZONE', color: '#c8973a' }
    : score >= 40 ? { label: 'Developing Wellbeing', badge: 'CAUTION ZONE', color: '#c8973a' }
    : { label: 'At Risk', badge: 'RISK ZONE', color: '#e05c5c' }

  const gccPct = score >= 80 ? 78 : score >= 60 ? 58 : score >= 40 ? 38 : 20

  /* Dimension breakdown */
  const dims = [
    {
      label: 'Emotional Resilience',
      score: emp.q8 != null ? Math.max(20, 100 - Math.round(emp.q8 * 16)) : 55
    },
    {
      label: 'Productivity & Focus',
      score: emp.q12 != null ? Math.round(emp.q12 * 18) : 72
    },
    {
      label: 'Social Connection',
      score: emp.q9 != null ? Math.round(emp.q9 * 18) : 80
    },
    {
      label: 'Work-Life Balance',
      score: emp.q7 != null ? Math.max(15, 100 - Math.round(emp.q7 * 14)) : 48
    },
    {
      label: 'Sense of Purpose',
      score: emp.q13 != null ? Math.round(emp.q13 * 18) : 75
    },
    {
      label: 'Burnout Risk',
      score: emp.q7 != null && emp.q8 != null
        ? Math.max(10, 100 - Math.round(((emp.q7 + emp.q8) / 2) * 14))
        : 62
    },
  ]

  const burnoutDim = dims.find(d => d.label === 'Burnout Risk')
  const burnoutLabel = burnoutDim.score >= 70 ? 'Low Risk' : burnoutDim.score >= 45 ? 'Moderate Risk' : 'High Risk'
  const burnoutColor = burnoutDim.score >= 70 ? '#4caf7d' : burnoutDim.score >= 45 ? '#c8973a' : '#e05c5c'

  const strongest = [...dims].sort((a, b) => b.score - a.score)[0]
  const focus = [...dims].sort((a, b) => a.score - b.score)[0]

  const recAction = focus.score < 40
    ? 'Immediate wellbeing support recommended'
    : focus.label === 'Work-Life Balance'
    ? 'Boundary-setting coaching session'
    : focus.label === 'Burnout Risk'
    ? 'Stress management programme'
    : 'Targeted wellbeing check-in'

  const dimColor = (s) => s >= 70 ? '#4caf7d' : s >= 45 ? '#c8973a' : '#e05c5c'

  return (
    <div className={styles.empReport}>
      {/* ── Header ── */}
      <div className={styles.reportHeader}>
        <div className={styles.reportHeaderLeft}>
          <p className={styles.reportEyebrow} style={{ color: '#c8973a' }}>
            YOUR PERSONAL REPORT · {MONTH_YEAR}
          </p>
          <h1 className={styles.reportHeroTitle}>
            Your Wellbeing Score Is{' '}
            <span style={{ color: '#c8973a' }}>{score}</span>
          </h1>
          <p className={styles.reportSubline}>
            Based on {Object.keys(data.answers || {}).length || 17} responses across 5 wellbeing dimensions
          </p>
        </div>
      </div>

      {/* ── Body: 2-col ── */}
      <div className={styles.reportBody}>
        {/* LEFT */}
        <div className={styles.reportMain}>

          {/* Score card */}
          <div className={styles.scoreCard} style={{ borderColor: 'rgba(200,151,58,0.2)', background: 'rgba(200,151,58,0.04)' }}>
            <CircleGauge score={score} color="#c8973a" />
            <div className={styles.scoreCardMeta}>
              <h2 className={styles.tierTitle} style={{ color: '#c8973a' }}>{tier.label}</h2>
              <span className={styles.tierBadge} style={{ borderColor: 'rgba(200,151,58,0.4)', color: '#c8973a' }}>
                {tier.badge}
              </span>
              <p className={styles.tierDesc}>
                {score >= 70
                  ? 'Your wellbeing is strong. You are managing work demands well and showing resilience across most dimensions.'
                  : score >= 50
                  ? `Your score indicates moderate workplace wellbeing with some areas of concern. Focus areas: ${focus.label.toLowerCase()} and resilience. You are performing above ${gccPct}% of GCC respondents.`
                  : 'Your wellbeing needs attention. Several dimensions show strain — consider seeking support from your EAP or a wellbeing coach.'}
              </p>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div className={styles.gapSection}>
            <p className={styles.gapTitle}>DIMENSION BREAKDOWN</p>
            <div className={styles.dimGrid}>
              {dims.map(d => (
                <DimCard key={d.label} label={d.label} score={d.score} color={dimColor(d.score)} />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.reportActions}>
            <button className={styles.actionPrimary} style={{ background: '#c8973a', color: '#0d1b2a' }}
              onClick={onDownloadPDF}>
              📄 Download My Report (PDF)
            </button>
            <button className={styles.actionOutline} style={{ borderColor: 'rgba(200,151,58,0.4)', color: '#c8973a' }}>
              Book 1:1 Coaching Session
            </button>
            <button className={styles.actionOutline} style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#6b7a8d' }}>
              Share Results
            </button>
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div className={styles.reportSidebar}>
          <div className={styles.sidebarBox} style={{ borderColor: 'rgba(200,151,58,0.15)' }}>
            <p className={styles.sidebarBoxTitle} style={{ color: '#c8973a' }}>QUICK INSIGHTS</p>
            <StatRow label="OVERALL SCORE" value={`${score} / 100`} valueColor="#fff" />
            <StatRow label="BURNOUT RISK LEVEL" value={burnoutLabel} valueColor={burnoutColor} />
            <StatRow label="STRONGEST AREA" value={`${strongest.label} (${strongest.score})`} valueColor="#4caf7d" />
            <StatRow label="FOCUS AREA" value={`${focus.label} (${focus.score})`} valueColor="#e05c5c" />
            <StatRow label="GCC PERCENTILE" value={`Above ${gccPct}% of respondents`} valueColor="#fff" />
            <StatRow label="RECOMMENDED ACTION" value={recAction} valueColor="#c8973a" />
          </div>

          {/* AI Guide card */}
          <div className={styles.pilotCard} style={{ borderColor: 'rgba(200,151,58,0.2)', background: 'rgba(200,151,58,0.04)' }}>
            <h3 className={styles.pilotTitle}>Your Free AI Guide</h3>
            <p className={styles.pilotDesc}>
              Based on your results, we've prepared a personalized 7-day micro-wellbeing plan to help you build resilience and improve work-life balance.
            </p>
            <button className={styles.pilotBtn} style={{ background: '#c8973a', color: '#0d1b2a' }}>
              Access Your Guide →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   NOT COMPLETED PLACEHOLDER
───────────────────────────────────────── */
const NotCompleted = ({ title, desc, onStart, accent }) => (
  <div className={styles.notCompleted} style={{ borderColor: `${accent}30` }}>
    <span className={styles.notCompletedIcon}>📋</span>
    <div>
      <p className={styles.notCompletedTitle}>{title}</p>
      <p className={styles.notCompletedDesc}>{desc}</p>
    </div>
    <button className={styles.notCompletedBtn}
      style={{ borderColor: `${accent}50`, color: accent }}
      onClick={onStart}>
      Start Survey →
    </button>
  </div>
)

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const SurveyResultsPage = ({
  type, decisionData, employeeData, onBack, onRetake, onForCorporates, onLogin
}) => {
  const isDecision = type === 'decision' || type === 'hr'
  const hasDecision = !!decisionData
  const hasEmployee = !!employeeData

  // Each role only ever sees their OWN survey data
  const myData = isDecision ? decisionData : employeeData

  const dm = decisionData || {}
  const emp = employeeData || {}
  const decisionScore = dm.decisionScore ?? null
  const employeeScore = emp.employeeScore ?? null

  const finalScore = decisionScore != null && employeeScore != null
    ? (decisionScore + employeeScore) / 2 : null

  const demandColor = finalScore >= 4 ? '#4caf7d' : finalScore >= 3 ? '#c8973a' : '#e05c5c'
  const demandText = finalScore >= 4 ? '🟢 Strong product demand'
    : finalScore >= 3 ? '🟡 Moderate demand' : '🔴 Weak demand'

  /* ── Generate PDF (only for current role) ── */
  const handleGeneratePDF = () => {
    const dmScore = hasDecision ? toHundred(decisionScore) : null
    const empScore = hasEmployee ? toHundred(employeeScore) : null
    
    // Using hasDecision + hasEmployee to figure out if both exist
    const finalS = dmScore && empScore ? ((parseFloat(dmScore) + parseFloat(empScore)) / 2).toFixed(0) : null
    const demand = finalS >= 80 ? '🟢 Strong product demand' : finalS >= 60 ? '🟡 Moderate demand' : '🔴 Weak demand'

    const myScore = isDecision ? dmScore : empScore
    const accent = isDecision ? '#4caf7d' : '#c8973a'
    const roleLabel = isDecision ? 'Decision Maker Report' : 'Employee Wellbeing Report'
    const scoreLabel = isDecision ? 'Organizational Readiness Score' : 'Wellbeing Score'

    const html = `<div style="font-family:Arial,sans-serif;background:#0d1b2a;color:#fff;padding:48px">
      <h1 style="font-size:18px;color:${accent};margin:0 0 4px">SEHATTI · GCC WELLBEING SURVEY</h1>
      <h2 style="font-size:14px;color:rgba(255,255,255,0.6);font-weight:400;margin:0 0 4px">${roleLabel}</h2>
      <p style="color:#6b7a8d;font-size:12px;margin:0 0 28px">Report generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      ${finalS ? `<div style="text-align:center;padding:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;margin-bottom:28px">
        <p style="font-size:10px;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin:0 0 8px">COMBINED VALIDATION SCORE</p>
        <p style="font-size:48px;margin:0;font-weight:400">${escapeHtml(((decisionScore + employeeScore) / 2).toFixed(1))}<span style="font-size:20px;color:rgba(255,255,255,0.3)">/5</span></p>
        <p style="font-size:15px;margin:8px 0 0;font-weight:600">${escapeHtml(demand)}</p>
      </div>` : ''}
      <div style="text-align:center;padding:28px;background:rgba(255,255,255,0.04);border:1px solid ${accent}44;border-radius:8px;margin-bottom:28px">
        <p style="font-size:10px;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin:0 0 8px">${escapeHtml(scoreLabel.toUpperCase())}</p>
        <p style="font-size:64px;margin:0;font-weight:400;color:${accent}">${escapeHtml(myScore)}<span style="font-size:22px;color:rgba(255,255,255,0.3)">/100</span></p>
        <p style="font-size:13px;color:rgba(255,255,255,0.5);margin:10px 0 0">Score (1-5): ${escapeHtml(fmt1(isDecision ? decisionScore : employeeScore))}</p>
      </div>
      ${isDecision
        ? `<p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Problem Severity (Q8):</strong> ${dm.q8 != null ? escapeHtml(dm.q8) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Budget Readiness (Q12):</strong> ${dm.q12 != null ? escapeHtml(dm.q12) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Decision Timeline (Q13):</strong> ${dm.q13 != null ? escapeHtml(dm.q13) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Pilot Approval (Q15):</strong> ${dm.q15 != null ? escapeHtml(dm.q15) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>AI Confidence (Q17):</strong> ${dm.q17 != null ? escapeHtml(dm.q17) + ' / 5' : 'N/A'}</p>`
        : `<p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Stress Frequency (Q7):</strong> ${emp.q7 != null ? escapeHtml(emp.q7) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Stress Severity (Q8):</strong> ${emp.q8 != null ? escapeHtml(emp.q8) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Mental Health Need (Q11):</strong> ${emp.q11 != null ? escapeHtml(emp.q11) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Tool Likelihood (Q12):</strong> ${emp.q12 != null ? escapeHtml(emp.q12) + ' / 5' : 'N/A'}</p>
           <p style="margin:0 0 8px;color:rgba(255,255,255,0.7)"><strong>Usage Frequency (Q13):</strong> ${emp.q13 != null ? escapeHtml(emp.q13) + ' / 5' : 'N/A'}</p>`
      }
      <p style="font-size:10px;color:#3d4f62;text-align:center;margin-top:40px">survey.sehatti.com - Confidential - Data never sold</p>
    </div>`

    const el = document.createElement('div')
    el.innerHTML = html
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:800px;'
    document.body.appendChild(el)
    const filename = isDecision ? 'Sehatti_Decision_Maker_Report.pdf' : 'Sehatti_Employee_Report.pdf'
    html2pdf().set({ margin: 0, filename, html2canvas: { scale: 2, backgroundColor: '#0d1b2a' }, jsPDF: { unit: 'px', format: [800, 1130], orientation: 'portrait' } })
      .from(el).save().then(() => document.body.removeChild(el))
  }

  /* ── Download JSON (only own data) ── */
  const handleDownloadJSON = () => {
    const key = isDecision ? 'decisionMakerSurvey' : 'employeeSurvey'
    const data = { exportedAt: new Date().toISOString(), [key]: myData || null }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = isDecision ? 'sehatti_decision_results.json' : 'sehatti_employee_results.json'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <Navbar
        isHR={isDecision}
        screenInfo={{
          screen: '4 OF 5',
          label: isDecision ? 'DECISION MAKER RESULTS · /RESULTS' : 'EMPLOYEE RESULTS · /RESULTS',
          status: 'Complete'
        }}
        onHome={onBack}
        onForCorporates={onForCorporates || (() => {})}
        onGoReport={() => {}}
        onLogin={onLogin}
      />

      <div className={styles.pageContent}>

        {/* ── Combined Score Banner ── */}
        {finalScore != null && (
          <div className={styles.combinedBanner} style={{ borderColor: `${demandColor}44`, background: `${demandColor}12` }}>
            <div>
              <p className={styles.combinedEyebrow}>COMBINED VALIDATION SCORE</p>
              <p className={styles.combinedDemand} style={{ color: demandColor }}>{demandText}</p>
              <p className={styles.combinedSub}>
                Decision Score ({fmt1(decisionScore)}/5) + Employee Score ({fmt1(employeeScore)}/5) = {fmt1(finalScore)}/5 average
              </p>
            </div>
            <div className={styles.combinedBig} style={{ color: demandColor }}>
              {fmt1(finalScore)}<span className={styles.combinedBigDen}>/5</span>
            </div>
          </div>
        )}

        {/* ══ Show ONLY the report for the current role ══ */}
        {isDecision ? (
          <div className={styles.reportBlock}>
            <div className={styles.reportBlockLabel} style={{ background: '#4caf7d' }}>
              📊 Decision Maker Report
            </div>
            {decisionData
              ? <DMReport data={decisionData} onDownloadPDF={handleGeneratePDF} />
              : (
                <div className={styles.notCompleted} style={{ borderColor: '#4caf7d44', margin: '24px' }}>
                  <span className={styles.notCompletedIcon}>📋</span>
                  <div>
                    <p className={styles.notCompletedTitle}>No Results Found</p>
                    <p className={styles.notCompletedDesc}>Please complete the Decision Maker survey first.</p>
                  </div>
                  <button className={styles.notCompletedBtn} style={{ borderColor: '#4caf7d50', color: '#4caf7d' }} onClick={onBack}>
                    Start Survey →
                  </button>
                </div>
              )
            }
          </div>
        ) : (
          <div className={styles.reportBlock}>
            <div className={styles.reportBlockLabel} style={{ background: '#c8973a', color: '#0d1b2a' }}>
              👤 Employee Wellbeing Report
            </div>
            {employeeData
              ? <EmpReport data={employeeData} onDownloadPDF={handleGeneratePDF} />
              : (
                <div className={styles.notCompleted} style={{ borderColor: '#c8973a44', margin: '24px' }}>
                  <span className={styles.notCompletedIcon}>📋</span>
                  <div>
                    <p className={styles.notCompletedTitle}>No Results Found</p>
                    <p className={styles.notCompletedDesc}>Please complete the Employee survey first.</p>
                  </div>
                  <button className={styles.notCompletedBtn} style={{ borderColor: '#c8973a50', color: '#c8973a' }} onClick={onBack}>
                    Start Survey →
                  </button>
                </div>
              )
            }
          </div>
        )}

        {/* ── Bottom actions ── */}
        <div className={styles.bottomActions}>
          <button className={styles.btnGold} onClick={onRetake}>Take Another Survey</button>
          <button className={styles.btnGhost} onClick={handleDownloadJSON}>Download JSON</button>
          <button className={styles.btnGhost} onClick={onBack}>← Back to Home</button>
          <span className={styles.trustNote}>survey.sehatti.com · Secure · Data never sold</span>
        </div>

      </div>

      <div className={styles.bottomBanner}>
        GCC WELLBEING SURVEY · {isDecision ? 'DECISION MAKER REPORT' : 'EMPLOYEE REPORT'} · {MONTH_YEAR}
      </div>
    </div>
  )
}

export default SurveyResultsPage
