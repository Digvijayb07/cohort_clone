'use client';
import Image from 'next/image';
import CurvedLoop from './CurvedLoop';

const logos = [
  { src: '/logos/acmlogo.jpg', name: 'ACM' },
  { src: '/logos/gfglog.jpg', name: 'GDGC' },
  { src: '/logos/nsslogo.png', name: 'NSS' },
  { src: '/logos/owasplogo.png', name: 'OWASP' },
  { src: '/logos/acmlogo.jpg', name: 'ACM' },
  { src: '/logos/gfglog.jpg', name: 'GDGC' },
  { src: '/logos/nsslogo.png', name: 'NSS' },
  { src: '/logos/owasplogo.png', name: 'OWASP' },
];

export default function CommunitiesSection() {
  return (
    <section className="communities-section">
      {/* Title */}
      <h2 className="communities-title">Connecting Communities</h2>

      {/* Logo Marquee */}
      <div className="logo-marquee-wrapper">
        <div className="logo-marquee-track">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="logo-marquee-item">
              <div className="logo-circle">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={36}
                  height={36}
                  className="logo-img"
                />
              </div>
              <span className="logo-name">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CurvedLoop Text Marquee - deep graceful curve with slower leisurely scroll */}
      <div className="curved-marquee-wrapper">
        <CurvedLoop
          marqueeText="COHORT SOCIAL ✦ CONNECT ✦ DISCOVER ✦ NAVIGATE ✦"
          speed={0.6}
          curveAmount={220}
          direction="left"
          interactive={true}
          className="curved-marquee-text"
        />
      </div>
    </section>
  );
}
