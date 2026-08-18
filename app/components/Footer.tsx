'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Horizontal Divider */}
        <div className="footer-horizontal-line footer-horizontal-line--top" />

        {/* Top Links & Social */}
        <div className="footer-top-grid">
          {/* Product column */}
          <div className="footer-col">
            <h4 className="footer-col-title footer-col-title--blue">Product</h4>
            <nav className="footer-nav">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="#" className="footer-link">Connect</Link>
              <Link href="#" className="footer-link">Maps</Link>
              <Link href="#" className="footer-link">Profile</Link>
            </nav>
          </div>

          {/* Vertical Divider 1 */}
          <div className="footer-vertical-line" />

          {/* Company column */}
          <div className="footer-col">
            <h4 className="footer-col-title footer-col-title--purple">Company</h4>
            <nav className="footer-nav">
              <Link href="#" className="footer-link">Communities</Link>
              <Link href="#" className="footer-link">Friends</Link>
              <Link href="#" className="footer-link">XD</Link>
              <Link href="#" className="footer-link">Maps</Link>
              <Link href="#" className="footer-link">Calendar</Link>
            </nav>
          </div>

          {/* Vertical Divider 2 */}
          <div className="footer-vertical-line" />

          {/* Spacer column to push social to right */}
          <div className="footer-col-spacer" />

          {/* Social icons */}
          <div className="footer-social-box">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="mailto:cohort@pccoe.edu.in" className="social-icon-btn" aria-label="Email">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Middle Horizontal Separator Line */}
        <div className="footer-horizontal-line" />

        {/* Bottom Area: Disclaimer on Left + Big Cohort Logo on Right */}
        <div className="footer-bottom-grid">
          <div className="footer-disclaimer-box">
            <h5 className="footer-disclaimer-title">Regulatory disclaimer</h5>
            <p className="footer-disclaimer-text">
              Cohort is a community platform, not a bank. Services are provided by
              partner organizations across the campus up to applicable limits.
            </p>
          </div>

          <div className="footer-brand-box">
            <div className="footer-brand-logo-icon">
              <svg width="54" height="54" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="16" stroke="url(#footerBrandGrad)" strokeWidth="2.5" fill="none"/>
                <circle cx="12" cy="18" r="5" fill="#5B4FE8"/>
                <circle cx="24" cy="18" r="5" fill="#E84FAA"/>
                <circle cx="18" cy="12.5" r="5" fill="#4FAAE8"/>
                <circle cx="18" cy="23.5" r="5" fill="#E8A44F"/>
                <defs>
                  <linearGradient id="footerBrandGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5B4FE8"/>
                    <stop offset="1" stopColor="#E84FAA"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="footer-brand-logo-text">Cohort</span>
          </div>
        </div>

        {/* Bottom-most line */}
        <div className="footer-horizontal-line footer-horizontal-line--bottom" />
      </div>
    </footer>
  );
}
