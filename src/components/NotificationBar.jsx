import { useState } from 'react'
import styles from './NotificationBar.module.css'

/* ── Report Artifact Modal ── */
const ReportModal = ({ onClose }) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <span className={styles.modalTitle}>Report Artifact</span>
        <button className={styles.modalClose} onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <p className={styles.modalDesc}>Why are you reporting this?</p>
      <select className={styles.modalSelect} defaultValue="">
        <option value="" disabled>Select report reason</option>
        <option value="copyright">Copyright infringement</option>
        <option value="trademark">Trademark infringement</option>
        <option value="child_safety">Child safety/sexual abuse</option>
        <option value="fraud">Fraud</option>
        <option value="explicit">Sexually Explicit content</option>
        <option value="hate_speech">Violence and/or hate speech</option>
        <option value="illegal">Illegal goods</option>
        <option value="court_order">Court order</option>
        <option value="other">Other</option>
      </select>
      <div className={styles.modalActions}>
        <button className={styles.modalCancel} onClick={onClose}>Cancel</button>
        <button className={styles.modalSubmit}>Submit Report</button>
      </div>
    </div>
  </div>
)

const NotificationBar = ({ views = 22 }) => {
  const [showReport, setShowReport] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Dynamic view counter
  const [liveViews, setLiveViews] = useState(() => {
    const hits = parseInt(localStorage.getItem('sehatti_views') || '142')
    localStorage.setItem('sehatti_views', (hits + 1).toString())
    return hits + 1
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className={styles.bar}>
        {/* Left */}
        <div className={styles.left}>
          <span className={styles.brand}>Claude</span>
          <span className={styles.info}>Content is user-generated and unverified.</span>
        </div>

        {/* Right */}
        <div className={styles.right}>
          {/* View count */}
          <div className={styles.iconGroup}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className={styles.icon}>
              <path d="M1 12C1 12 5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className={styles.viewCount}>{liveViews}</span>
          </div>

          {/* Copy Link icon (replaces Share) */}
          <button
            className={styles.iconBtn}
            aria-label="Copy link"
            onClick={handleCopyLink}
            title={copied ? 'Copied!' : 'Copy link'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Flag icon → Report modal */}
          <button
            className={styles.iconBtn}
            aria-label="Report artifact"
            onClick={() => setShowReport(true)}
            title="Report artifact"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </>
  )
}

export default NotificationBar
