import styles from './TopBanner.module.css'

/**
 * TopBanner — appears at the very top of every page, above the Navbar.
 * Gold background (Employee) or dark green (HR).
 * Props:
 *   isHR   – bool, switches theme
 *   text   – optional custom text (defaults to the wireframe mockup line)
 */
const TopBanner = ({ isHR, text }) => {
  const defaultText = isHR
    ? 'HR / MANAGER ASSESSMENT FLOW → SURVEY.SEHATTI.COM/HR'
    : 'HIGH FIDELITY WIREFRAME MOCKUP — SEHATTI WORKPLACE WELLBEING DIAGNOSTIC PORTAL — SURVEY.SEHATTI.COM'

  return (
    <div className={`${styles.banner} ${isHR ? styles.bannerHR : ''}`}>
      {text || defaultText}
    </div>
  )
}

export default TopBanner
