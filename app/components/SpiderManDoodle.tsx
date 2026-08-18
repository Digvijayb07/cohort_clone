'use client';

import React from 'react';

export function SpiderManHeaderDoodle() {
  return (
    <div className="absolute -top-3 -left-7 pointer-events-none z-10 opacity-90 hover:opacity-100 transition-opacity">
      <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Web line */}
        <path d="M50 0 L50 25" stroke="#333" strokeWidth="2.5" strokeDasharray="3 2" />
        {/* Spider-Man Head */}
        <path d="M30 45 C30 25 70 25 70 45 C70 68 55 78 50 78 C45 78 30 68 30 45 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="3" />
        {/* Web lines on face */}
        <path d="M50 30 L50 76 M35 45 L65 45 M38 35 L62 58 M62 35 L38 58" stroke="#1E293B" strokeWidth="1.5" opacity="0.6" />
        {/* White Eyes */}
        <path d="M36 40 C42 40 46 48 46 52 C38 52 34 46 36 40 Z" fill="white" stroke="#1E293B" strokeWidth="2.5" />
        <path d="M64 40 C58 40 54 48 54 52 C62 52 66 46 64 40 Z" fill="white" stroke="#1E293B" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

export function SpiderManSidebarDoodle({ type = 'calendar' }: { type?: 'calendar' | 'profile' }) {
  return (
    <div className={`absolute ${type === 'calendar' ? '-right-6 -top-2' : '-right-6 -bottom-1'} pointer-events-none z-10 opacity-85`}>
      <svg width="34" height="38" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hanging Web Line */}
        <path d="M50 0 L50 35" stroke="#1E293B" strokeWidth="3" strokeDasharray="4 2" />
        {/* Upside Down Body/Head */}
        <g transform="rotate(180 50 65)">
          <path d="M32 45 C32 28 68 28 68 45 C68 65 54 75 50 75 C46 75 32 65 32 45 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="3" />
          <path d="M50 30 L50 73 M37 45 L63 45 M39 36 L61 56 M61 36 L39 56" stroke="#1E293B" strokeWidth="1.5" opacity="0.6" />
          {/* Eyes */}
          <path d="M37 40 C43 40 47 47 47 51 C39 51 35 45 37 40 Z" fill="white" stroke="#1E293B" strokeWidth="2" />
          <path d="M63 40 C57 40 53 47 53 51 C61 51 65 45 63 40 Z" fill="white" stroke="#1E293B" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
