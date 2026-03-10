import { useState } from 'react'
import styles from './Navbar.module.css'

const SehattLogo = () => {
  return (
    <div className={styles.logoWrap}>
      <div className={styles.logoIconCircle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3 C12 3 7 7 7 12 C7 15.5 9.5 17 12 17 C14.5 17 17 15.5 17 12 C17 7 12 3 12 3Z"
            fill="none" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M12 3 C12 3 17 7 17 12 C17 15.5 14.5 17 12 17"
            fill="none" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <path d="M12 17 C12 17 5 16 4 12 C3.5 9 6 7 9 8"
            fill="none" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          <path d="M12 17 C12 17 19 16 20 12 C20.5 9 18 7 15 8"
            fill="none" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
          <circle cx="12" cy="17" r="1.5" fill="#C9963A"/>
          <line x1="12" y1="18.5" x2="12" y2="22" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <span className={styles.logoText}>
        <span className={styles.logoSeh}>SEH</span>
        <span className={styles.logoAtti}>ATTI</span>
      </span>
    </div>
  )
}

const Navbar = ({ screenInfo, onHome, onForCorporates, onGoReport, onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleHome = () => { onHome(); closeMenu() }
  const handleGoReport = () => { (onGoReport || onHome)(); closeMenu() }
  const handleForCorporates = () => { onForCorporates(); closeMenu() }
  const handleLogin = () => { onLogin(); closeMenu() }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navMain}>
        {/* LEFT — Logo */}
        <button className={styles.logoBtn} onClick={handleHome}>
          <SehattLogo />
        </button>

        {/* Hamburger Menu Toggle (Mobile Only) */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* RIGHT — Screen info on top, nav links below (Desktop) */}
        <div className={styles.navRight}>
          {/* Top row: screen info */}
          {screenInfo && (
            <div className={styles.screenInfo}>
              <span className={styles.screenLabel}>
                SCREEN {screenInfo.screen} — {screenInfo.label}
              </span>
            </div>
          )}

          {/* Bottom row: nav links + login */}
          <div className={styles.navLinks}>
            <button className={styles.navLink} onClick={handleHome}>
              About
            </button>
            <button className={styles.navLink} onClick={handleGoReport}>
              GCC Report 2026
            </button>
            <button className={styles.navLink} onClick={handleForCorporates}>
              For Corporates
            </button>
            <button className={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {screenInfo && (
            <div className={styles.mobileScreenInfo}>
              <span className={styles.screenLabel}>
                SCREEN {screenInfo.screen} — {screenInfo.label}
              </span>
            </div>
          )}
          <button className={styles.mobileNavLink} onClick={handleHome}>
            About
          </button>
          <button className={styles.mobileNavLink} onClick={handleGoReport}>
            GCC Report 2026
          </button>
          <button className={styles.mobileNavLink} onClick={handleForCorporates}>
            For Corporates
          </button>
          <button className={styles.mobileLoginBtn} onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
