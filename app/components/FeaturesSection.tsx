'use client';

interface Feature {
  icon: React.ReactNode;
  name: string;
  description: string;
  highlighted?: boolean;
  gradientTitle?: boolean;
}

const features: Feature[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
      </svg>
    ),
    name: 'Home Feed',
    description: 'Stay updated with a personalized feed of posts, announcements, and discussions from your subscribed communities and friends across campus.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    name: 'Communities',
    description: 'Discover and join 30+ student-run clubs and organizations at PCCOE — from OWASP and GDGC to Art Circle and NSS.',
    gradientTitle: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    name: 'Friends',
    description: 'Build your campus network by adding friends, viewing their activity, and staying connected through shared communities.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    name: 'Connect',
    description: 'Real-time encrypted messaging with end-to-end privacy. Chat one-on-one or in group conversations with fellow students.',
    highlighted: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    name: 'XD (Exchange)',
    description: 'An anonymous exchange board where students share honest thoughts, campus tips, and creative ideas freely.',
    gradientTitle: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
    name: 'Campus Maps',
    description: 'Interactive 3D campus navigation powered by TomTom — find classrooms, labs, cafeterias, and event venues instantly.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    name: 'Academic Calendar',
    description: "Never miss an exam, holiday, or submission deadline. Sync your academic schedule and get timely reminders.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    name: 'Student Profile',
    description: 'Showcase your achievements, certifications, and hackathon wins. Build a professional portfolio visible to peers and faculty.',
    gradientTitle: true,
  },
];

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Explore Platform Features</h2>
          <p className="features-subtitle">
            From <span className="highlight-text">encrypted messaging</span> to real-time campus navigation, discover all the
            tools designed to empower your <span className="highlight-text">social</span> experience.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className={`feature-card ${feature.highlighted ? 'feature-card-highlighted' : ''}`}>
              <div className="feature-icon-wrap">{feature.icon}</div>
              <h3 className={`feature-name ${feature.gradientTitle ? 'feature-name--gradient' : ''}`}>
                {feature.name}
              </h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
