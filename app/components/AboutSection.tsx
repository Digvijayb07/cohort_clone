'use client';

export default function AboutSection() {
  return (
    <section className="about-section">
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
