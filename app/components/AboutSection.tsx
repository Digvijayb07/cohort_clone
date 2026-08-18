'use client';

export default function AboutSection() {
  return (
    <section className="about-section">
      {/* Decorative figures */}
      <div className="about-deco about-deco-left-top">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" opacity="0.18">
          <ellipse cx="30" cy="40" rx="18" ry="30" stroke="#3B39BC" strokeWidth="1.5"/>
          <circle cx="30" cy="20" r="8" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="22" y1="45" x2="15" y2="65" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="38" y1="45" x2="45" y2="65" stroke="#3B39BC" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="about-deco about-deco-right-top">
        <svg width="55" height="72" viewBox="0 0 55 72" fill="none" opacity="0.18">
          <ellipse cx="27" cy="36" rx="16" ry="27" stroke="#3B39BC" strokeWidth="1.5"/>
          <circle cx="27" cy="17" r="7" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="20" y1="40" x2="13" y2="58" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="34" y1="40" x2="41" y2="58" stroke="#3B39BC" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="about-deco about-deco-left-bottom">
        <svg width="52" height="68" viewBox="0 0 52 68" fill="none" opacity="0.18">
          <ellipse cx="26" cy="34" rx="15" ry="25" stroke="#3B39BC" strokeWidth="1.5"/>
          <circle cx="26" cy="16" r="7" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="19" y1="38" x2="12" y2="55" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="33" y1="38" x2="40" y2="55" stroke="#3B39BC" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="about-deco about-deco-right-bottom">
        <svg width="50" height="65" viewBox="0 0 50 65" fill="none" opacity="0.18">
          <ellipse cx="25" cy="33" rx="14" ry="23" stroke="#3B39BC" strokeWidth="1.5"/>
          <circle cx="25" cy="15" r="6" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="19" y1="37" x2="12" y2="53" stroke="#3B39BC" strokeWidth="1.5"/>
          <line x1="31" y1="37" x2="38" y2="53" stroke="#3B39BC" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="about-container">
        <h2 className="about-title">About Cohort PCCOE</h2>

        <div className="about-body">
          <p>
            Cohort is the official student social platform built exclusively for{' '}
            <strong>Pimpri Chinchwad College of Engineering (PCCOE)</strong>, Pune. Designed and developed by students, for students,
            it serves as the central hub where over 350 active users connect, collaborate, and stay informed about everything
            happening on campus.
          </p>

          <p>
            Unlike generic social media platforms, Cohort is purpose-built for the college ecosystem. It aggregates more
            than 30 student-run communities and clubs — including technical organizations like <strong>OWASP</strong>,{' '}
            <strong>Google Developer Groups on Campus (GDGC)</strong>, <strong>ACM</strong>, and <strong>Geeks for Geeks</strong>,
            as well as creative and social clubs like <strong>Art Circle</strong>, <strong>NSS</strong>, and <strong>ISR</strong>.
            Students can subscribe to communities, receive real-time post notifications, and participate in discussions without
            switching between multiple WhatsApp groups or Instagram pages.
          </p>

          <p>
            <span className="about-highlight">
              The platform features <strong>end-to-end encrypted messaging</strong> through the Connect module, allowing students to
              chat privately with friends or in groups.
            </span>{' '}
            The <strong>XD (Exchange)</strong> board offers an anonymous space for campus-wide discussions, enabling students to
            share honest feedback, creative ideas, and study tips freely.
          </p>

          <p>
            Cohort also includes an <strong>interactive campus map</strong> powered by TomTom, helping new students and visitors
            navigate PCCOE&apos;s sprawling campus. The integrated <strong>academic calendar</strong> keeps everyone synchronized with
            exam schedules, holidays, and submission deadlines. Students can build their professional presence through{' '}
            <strong>achievement profiles</strong>, showcasing certifications, hackathon wins, and project accomplishments to peers
            and faculty alike.
          </p>

          <p>
            Built with modern technologies including React, Supabase, and real-time WebSocket connections, Cohort
            represents a new standard for campus digital infrastructure — one that prioritizes student privacy, community
            engagement, and seamless campus life management.
          </p>
        </div>
      </div>
    </section>
  );
}
