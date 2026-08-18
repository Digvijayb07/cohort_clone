'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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
            <Link href="/login" className="btn-primary">Get Started</Link>
            <button className="btn-secondary">Explore platform</button>
          </div>
        </div>

        {/* Right Side - Dashboard Card */}
        <div className="hero-right">
          <div className="dashboard-card-outer">
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
          </div>
        </div>
      </div>
    </section>
  );
}
