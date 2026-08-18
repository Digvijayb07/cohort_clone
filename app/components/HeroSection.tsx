'use client';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* LiquidEther Background */}
      <div className="hero-bg">
        <LiquidEther
          colors={['#3B39BC', '#FFDBC3', '#D2C8D2']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Left Side */}
        <div className="hero-left">
          {/* Decorative figures */}
          <div className="hero-deco hero-deco-top">
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none" opacity="0.3">
              <ellipse cx="30" cy="40" rx="18" ry="30" stroke="#3B39BC" strokeWidth="1.5"/>
              <circle cx="30" cy="20" r="8" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="22" y1="45" x2="15" y2="65" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="38" y1="45" x2="45" y2="65" stroke="#3B39BC" strokeWidth="1.5"/>
            </svg>
          </div>

          <h1 className="hero-title">
            A Social<br />
            Platform for<br />
            PCCOE
          </h1>

          <p className="hero-subtitle">
            Aggregate discussions, campus navigation, and encrypted
            messaging in real time. Monitor events and track opportunities
            —all without juggling multiple logins.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Explore platform</button>
          </div>

          {/* Bottom deco */}
          <div className="hero-deco hero-deco-bottom">
            <svg width="55" height="75" viewBox="0 0 55 75" fill="none" opacity="0.3">
              <ellipse cx="27" cy="38" rx="16" ry="27" stroke="#3B39BC" strokeWidth="1.5"/>
              <circle cx="27" cy="18" r="7" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="20" y1="42" x2="13" y2="60" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="34" y1="42" x2="41" y2="60" stroke="#3B39BC" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>

        {/* Right Side - Dashboard Card */}
        <div className="hero-right">
          <div className="dashboard-card">
            {/* Window Controls */}
            <div className="card-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
            </div>

            {/* Stats */}
            <div className="card-body">
              <p className="card-label">TOTAL PROJECT VIEWS</p>
              <div className="card-stat">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/>
                </svg>
                <span className="stat-number">11,516</span>
                <span className="stat-badge">↗ +6.2%</span>
              </div>
              <p className="card-sublabel">Updating in realtime</p>

              {/* Bar Chart */}
              <div className="bar-chart">
                {[30, 45, 35, 55, 50, 65, 60, 75, 70, 85, 80, 95].map((h, i) => (
                  <div
                    key={i}
                    className="bar"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side decorative figure */}
          <div className="hero-deco hero-deco-right-top">
            <svg width="50" height="65" viewBox="0 0 50 65" fill="none" opacity="0.25">
              <ellipse cx="25" cy="33" rx="14" ry="23" stroke="#3B39BC" strokeWidth="1.5"/>
              <circle cx="25" cy="15" r="6" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="19" y1="37" x2="12" y2="53" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="31" y1="37" x2="38" y2="53" stroke="#3B39BC" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="hero-deco hero-deco-right-bottom">
            <svg width="48" height="60" viewBox="0 0 48 60" fill="none" opacity="0.25">
              <ellipse cx="24" cy="30" rx="13" ry="21" stroke="#3B39BC" strokeWidth="1.5"/>
              <circle cx="24" cy="14" r="6" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="18" y1="34" x2="11" y2="50" stroke="#3B39BC" strokeWidth="1.5"/>
              <line x1="30" y1="34" x2="37" y2="50" stroke="#3B39BC" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
