'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!agreed) {
      alert('Please agree to the Terms and Conditions and Privacy Policy first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Supabase Google sign-in error:', err);
      setErrorMsg(err.message || 'Failed to initialize Google authentication');
      setLoading(false);
    }
  };

  return (
    <div className="login-backdrop">
      {/* Spotlight glow effect */}
      <div className="login-spotlight" />

      {/* Back to home / close button */}
      <Link href="/" className="login-close-btn" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Link>

      {/* Centered Modal Card */}
      <div className="login-modal-card">
        {/* Left Side: Artwork Image */}
        <div className="login-card-left">
          <Image
            src="/login_image.jpg"
            alt="Cohort 3D Mannequin Artwork"
            fill
            priority
            className="login-artwork-img"
          />
        </div>

        {/* Right Side: Welcome & Sign In Form */}
        <div className="login-card-right">
          {/* Cohort Logo Icon */}
          <div className="login-logo-icon">
            <svg width="46" height="46" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" stroke="url(#loginCardGrad)" strokeWidth="2.5" fill="none" />
              <circle cx="12" cy="18" r="5" fill="#5B4FE8" />
              <circle cx="24" cy="18" r="5" fill="#E84FAA" />
              <circle cx="18" cy="12.5" r="5" fill="#4FAAE8" />
              <circle cx="18" cy="23.5" r="5" fill="#E8A44F" />
              <defs>
                <linearGradient id="loginCardGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5B4FE8" />
                  <stop offset="1" stopColor="#E84FAA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Heading */}
          <h1 className="login-title">WELCOME TO<br />COHORT</h1>

          {/* Subtitle */}
          <p className="login-subtitle">
            Connect, message, and innovate with your campus community
          </p>

          {/* Terms & Conditions Checkbox */}
          <label className="login-terms-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="login-checkbox"
            />
            <span className="login-terms-text">
              I agree to the{' '}
              <a href="#" className="login-terms-link">Terms and Conditions</a> and{' '}
              <a href="#" className="login-terms-link">Privacy Policy</a>
            </span>
          </label>

          {/* Google Sign In Button / Pill */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="login-google-pill"
            aria-label="Sign in with Google"
          >
            {/* User avatar on left */}
            <div className="login-pill-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            {/* Middle account text */}
            <div className="login-pill-text-box">
              <span className="login-pill-name">
                {loading ? 'Connecting Google Auth...' : 'Sign in as 013_Digvijay_birajdar'}
              </span>
              <span className="login-pill-email">
                digvijay.birajdar24@pccoepune.org
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginLeft: '4px' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {/* Google G Logo on right */}
            <div className="login-pill-google-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
          </button>

          {errorMsg && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '14px', textAlign: 'center' }}>
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
