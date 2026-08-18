'use client';
import Image from 'next/image';

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

const textItems = [
  'Cohort social',
  '✦',
  'Connext',
  '✦',
  'Discover',
  '✦',
  'Navigate',
  '✦',
  'Cohort social',
  '✦',
  'Connext',
  '✦',
  'Discover',
  '✦',
  'Navigate',
  '✦',
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

      {/* Curved Text Marquee */}
      <div className="text-marquee-wrapper">
        <div className="text-marquee-track">
          {[...textItems, ...textItems].map((item, i) => (
            <span key={i} className={`text-marquee-item ${item === '✦' ? 'marquee-star' : ''}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
